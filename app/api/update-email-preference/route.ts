import prisma from "@/lib/prisma";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";
import { NextResponse } from "next/server";

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function POST(req: Request) {
  try {
    const { emailReminders } = await req.json();
    const accessToken = extractAccessToken(req);

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token missing" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Update user preference
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(decoded.userId) },
      data: { emailReminders },
    });

    return NextResponse.json({
      success: true,
      emailReminders: updatedUser.emailReminders,
    });
  } catch (error) {
    errorWithFile(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
