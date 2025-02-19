import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/email";
import crypto from "crypto";
import { errorWithFile } from "@/utils/logger";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  let user: any;
  try {
    user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { redirect: "/already-verified" },
        { status: 200 }
      );
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update the user with the new token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Send a new verification email
    const verificationUrl = `${process.env.API_URL}/api/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Click this link to verify your email: ${verificationUrl}`,
    });

    return NextResponse.json(
      { redirect: "/verification-email-sent" },
      { status: 200 }
    );
  } catch (error) {
    errorWithFile(error, user?.id);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
