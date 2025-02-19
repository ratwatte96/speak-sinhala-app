import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";

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

  let user: any;
  try {
    // Check if the user exists
    user = await prisma.user.findUnique({ where: { email } });
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

    // Check if user is within the 24-hour temp access period
    const timeSinceSignup = Date.now() - new Date(user.createdAt).getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    let accessToken;
    let refreshToken = null;
    let accessTokenExpiry;

    if (!user.isVerified) {
      if (timeSinceSignup > oneDayInMs) {
        return NextResponse.json(
          {
            error:
              "Your 24-hour access has expired. Please verify your email to continue.",
          },
          { status: 403 }
        );
      }
      // Temporary unverified user: 24-hour access token
      accessTokenExpiry = 24 * 60 * 60; // 24 hours
      accessToken = generateAccessToken(
        { userId: `${user.id}`, email: user.email },
        "24h"
      );
    } else {
      accessToken = generateAccessToken({
        userId: `${user.id}`,
        email: user.email,
      });
      refreshToken = generateRefreshToken(`${user.id}`);
    }

    // ?(Optional) Save refresh token in the database or send it as an HTTP-only cookie

    // Determine cookie security based on environment
    const isDev = process.env.NODE_ENV === "development";
    const cookieOptions = {
      accessToken: [
        `accessToken=${accessToken}`,
        "HttpOnly",
        "Path=/",
        `Max-Age=${accessTokenExpiry}`,
        isDev ? "" : "Secure",
      ]
        .filter(Boolean)
        .join("; "),
      refreshToken: refreshToken
        ? [
            `refreshToken=${refreshToken}`,
            "HttpOnly",
            "Path=/",
            "Max-Age=604800", // 7 days
            isDev ? "" : "Secure",
          ]
            .filter(Boolean)
            .join("; ")
        : null,
    };

    return NextResponse.json(
      { message: "Login successful" },
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
    errorWithFile(error, user?.id);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
