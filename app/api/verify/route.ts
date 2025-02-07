import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verification-error", req.url));
  }

  try {
    // Find the user with the token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/verification-error", req.url));
    }

    // Mark the user as verified and remove the token
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    return NextResponse.redirect(new URL("/verification-success", req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/verification-error", req.url));
  }
}
