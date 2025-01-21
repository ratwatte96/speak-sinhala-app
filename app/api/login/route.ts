import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(req: any) {
  const { email, password } = await req.json();

  // Validate email and password
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: `${user.id}`,
      email: user.email,
      // ! isPremium: user.isPremium,
    });
    const refreshToken = generateRefreshToken(`${user.id}`);

    // ?(Optional) Save refresh token in the database or send it as an HTTP-only cookie

    return new NextResponse("Login successful", {
      status: 200,
      headers: {
        "Set-Cookie": [
          `accessToken=${accessToken}; HttpOnly; Secure; Path=/; Max-Age=900`, // 15 minutes
          `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=604800`, // 7 days
        ].join(", "), // Combine cookies into a single string
      },
    });
  } catch (error: any) {
    console.error("Error during login:", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
