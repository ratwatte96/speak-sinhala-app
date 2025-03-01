import prisma from "@/lib/prisma";
import { errorWithFile } from "@/utils/logger";

// Precompile regex patterns once
const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordCriteria = {
  length: (password: string) => password.length >= 8,
  uppercase: (password: string) => /[A-Z]/.test(password),
  number: (password: string) => /[0-9]/.test(password),
  specialChar: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
};

export async function POST(req: Request) {
  const { username, email, password, gender } = await req.json();

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
