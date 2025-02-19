import prisma from "@/lib/prisma";
import { errorWithFile } from "@/utils/logger";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return new Response(
      JSON.stringify({ error: "Username, email, and password are required" }),
      { status: 400 }
    );
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  if (!usernameRegex.test(username)) {
    return new Response(
      JSON.stringify({
        error:
          "Invalid username. Use at least 3 characters with only letters, numbers, or underscores.",
      }),
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email format" }), {
      status: 400,
    });
  }

  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    return new Response(
      JSON.stringify({ error: "Password does not meet security criteria" }),
      { status: 400 }
    );
  }

  let existingUser: any;
  try {
    existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already taken" }), {
        status: 409,
      });
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });
    if (existingUsername) {
      return new Response(JSON.stringify({ error: "Username already taken" }), {
        status: 409,
      });
    }

    return new Response(JSON.stringify({ message: "Validation successful" }), {
      status: 200,
    });
  } catch (error: any) {
    errorWithFile(error, existingUser?.id);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
