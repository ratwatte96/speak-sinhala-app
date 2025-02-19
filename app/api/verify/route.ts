import prisma from "@/lib/prisma";
import { errorWithFile } from "@/utils/logger";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verification-error", req.url));
  }

  let user: any;
  try {
    // Find the user with the token
    user = await prisma.user.findFirst({
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
    errorWithFile(error, user?.id);
    return NextResponse.redirect(new URL("/verification-error", req.url));
  }
}
