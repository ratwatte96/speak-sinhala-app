import prisma from "@/lib/prisma";
import { errorWithFile } from "@/utils/logger";
import { validateLocalXPData } from "@/utils/localStorageXP";
import { isValidQuizType } from "@/app/lib/experience-points";
import { getSriLankaDayAnchor } from "@/app/lib/experience-points";
import type { LocalStorageXP } from "@/utils/localStorageXP";

// Precompile regex patterns once
const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordCriteria = {
  length: (password: string) => password.length >= 8,
  uppercase: (password: string) => /[A-Z]/.test(password),
  number: (password: string) => /[0-9]/.test(password),
  specialChar: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
};

interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
  gender: string;
  localXP?: LocalStorageXP;
}

export async function POST(req: Request) {
  const body = (await req.json()) as SignupRequestBody;
  const { username, email, password, gender, localXP } = body;

  // Input Validation
  if (!username || !email || !password || !gender) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
    });
  }

  if (!usernameRegex.test(username)) {
    return new Response(
      JSON.stringify({
        error: "Invalid username",
        field: "username",
        message:
          "Username should contain at least 3 characters with only letters, numbers, or underscores.",
      }),
      { status: 400 }
    );
  }

  if (!emailRegex.test(email)) {
    return new Response(
      JSON.stringify({
        error: "Invalid email format",
        field: "email",
      }),
      { status: 400 }
    );
  }

  if (gender !== "male" && gender !== "female") {
    return new Response(
      JSON.stringify({
        error: "Invalid gender",
        field: "gender",
      }),
      { status: 400 }
    );
  }

  const failedCriteria = Object.keys(passwordCriteria).find(
    (key) => !passwordCriteria[key as keyof typeof passwordCriteria](password)
  );

  if (failedCriteria) {
    return new Response(
      JSON.stringify({
        error: "Weak password",
        field: "password",
        message: `Password must contain at least ${
          failedCriteria === "length"
            ? "8 characters"
            : failedCriteria === "uppercase"
            ? "one uppercase letter"
            : failedCriteria === "number"
            ? "one number"
            : "one special character"
        }.`,
      }),
      { status: 400 }
    );
  }

  // Validate XP data if provided
  if (localXP) {
    if (!validateLocalXPData(localXP)) {
      return new Response(
        JSON.stringify({
          error: "Invalid XP data structure",
          field: "localXP",
        }),
        { status: 400 }
      );
    }

    // Validate XP amounts and dates
    const today = getSriLankaDayAnchor().toISOString().split("T")[0];
    for (const entry of localXP.dailyXP) {
      if (entry.date > today) {
        return new Response(
          JSON.stringify({
            error: "Invalid XP data: future dates not allowed",
            field: "localXP",
          }),
          { status: 400 }
        );
      }

      if (entry.amount < 0 || entry.amount > 1000) {
        return new Response(
          JSON.stringify({
            error: "Invalid XP amount",
            field: "localXP",
          }),
          { status: 400 }
        );
      }

      // Validate quiz types
      if (!entry.completedQuizTypes.every(isValidQuizType)) {
        return new Response(
          JSON.stringify({
            error: "Invalid quiz type in XP data",
            field: "localXP",
          }),
          { status: 400 }
        );
      }
    }
  }

  try {
    // Single query to check both email and username existence
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: { email: true, username: true },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          error:
            existingUser.email === email
              ? "Email already taken"
              : "Username already taken",
          field: existingUser.email === email ? "email" : "username",
        }),
        { status: 409 }
      );
    }

    return new Response(JSON.stringify({ message: "Validation successful" }), {
      status: 200,
    });
  } catch (error) {
    errorWithFile(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
