import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/email";
import { generateResetToken, verifyAccessToken } from "@/utils/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookies = req.headers.get("cookie");
    if (!cookies) {
      return NextResponse.json({ error: "No cookies found" }, { status: 400 });
    }

    // Parse cookies (basic approach)
    const cookieArray = cookies
      .split("; ")
      .map((cookie: any) => cookie.split("="));
    const cookieMap = Object.fromEntries(cookieArray);

    const accessToken = cookieMap["accessToken"];

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token missing" },
        { status: 401 }
      );
    }

    const decoded: any = verifyAccessToken(accessToken);
    const email = decoded.email;
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Generate password reset token
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 3600 * 1000); // 1-hour expiration

    // Store token in DB
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetExpires,
      },
    });

    // Construct reset URL
    const resetUrl = `${process.env.API_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password (This link expires in 1 hour): ${resetUrl}`,
    });

    return NextResponse.json(
      { message: "Password reset email sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
