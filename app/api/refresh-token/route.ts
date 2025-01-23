import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAccessToken, verifyRefreshToken } from "@/utils/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  const cookieStore = cookies(); // Use the cookies utility
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token missing" },
      { status: 401 }
    );
  }

  try {
    const decoded: any = verifyRefreshToken(refreshToken.value); // Verify refresh token

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    console.log(user);
    const newAccessToken = generateAccessToken({
      userId: `${user.id}`,
      email: user.email,
      isPremium: user.isPremium,
    });

    return new NextResponse("Token refreshed", {
      status: 200,
      headers: {
        "Set-Cookie": `accessToken=${newAccessToken}; HttpOnly; Secure; Path=/; Max-Age=${process.env.ACCESS_TOKEN_AGE}`, // 15 minutes
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
