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
      isPremium: user.isPremium,
    });
    const refreshToken = generateRefreshToken(`${user.id}`);

    // ?(Optional) Save refresh token in the database or send it as an HTTP-only cookie

    // Determine cookie security based on environment
    const isDev = process.env.NODE_ENV === "development";
    const cookieOptions = {
      accessToken: [
        `accessToken=${accessToken}`,
        "HttpOnly",
        "Path=/",
        `Max-Age=${process.env.ACCESS_TOKEN_AGE}`, // 15 minutes
        isDev ? "" : "Secure",
      ]
        .filter(Boolean)
        .join("; "),
      refreshToken: [
        `refreshToken=${refreshToken}`,
        "HttpOnly",
        "Path=/",
        "Max-Age=604800", // 7 days
        isDev ? "" : "Secure",
      ]
        .filter(Boolean)
        .join("; "),
    };

    return NextResponse.json(
      { message: "Logout successful" },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            cookieOptions.accessToken,
            cookieOptions.refreshToken,
          ].join(", "),
        },
      }
    );
  } catch (error: any) {
    console.error("Error during login:", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
