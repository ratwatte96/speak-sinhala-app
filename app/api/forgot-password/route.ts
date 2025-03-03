import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/email";
import {
  extractAccessToken,
  generateResetToken,
  verifyAccessToken,
} from "@/utils/auth";
import prisma from "@/lib/prisma";
import { errorWithFile } from "@/utils/logger";

export async function POST(req: Request) {
  let decoded: any;
  try {
    const accessToken = extractAccessToken(req);
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token missing" },
        { status: 401 }
      );
    }

    decoded = verifyAccessToken(accessToken);
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
      subject: "Learn Sinhala: Password Reset Request",
      text: `Click the link to reset your password (This link expires in 1 hour): ${resetUrl}`,
    });

    return NextResponse.json(
      { message: "Password reset email sent." },
      { status: 200 }
    );
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
