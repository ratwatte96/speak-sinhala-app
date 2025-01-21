import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken, generateAccessToken } from "@/utils/auth";

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
    const decoded: any = verifyAccessToken(refreshToken.value); // Verify refresh token

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      //!   isPremium: decoded.isPremium,
    });

    return new NextResponse("Token refreshed", {
      status: 200,
      headers: {
        "Set-Cookie": `accessToken=${newAccessToken}; HttpOnly; Secure; Path=/; Max-Age=900`, // 15 minutes
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
