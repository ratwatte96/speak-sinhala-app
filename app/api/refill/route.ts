import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";

/**
 * Fetches user with refills and lives.
 */
async function getUserWithRefills(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { refills: true, lives: true },
  });
}

/**
 * GET: Retrieve refill details for a user.
 */
export async function GET(req: Request) {
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
    const user = await getUserWithRefills(parseInt(decoded.userId));

    if (!user || user.refills.length === 0) {
      return NextResponse.json(
        { error: "No refill records found" },
        { status: 404 }
      );
    }

    const refill = await prisma.refill.findUnique({
      where: { id: user.refills[0].refillId },
    });

    return refill
      ? NextResponse.json(refill, { status: 200 })
      : NextResponse.json(
          { error: "Refill record not found" },
          { status: 404 }
        );
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to get refills" },
      { status: 500 }
    );
  }
}

/**
 * POST: Use a refill to restore lives.
 */
export async function POST(req: Request) {
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
    const user = await getUserWithRefills(parseInt(decoded.userId));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRefill: any = user.refills.length > 0 ? user.refills[0] : null;
    if (!userRefill || userRefill.total_refill === 0) {
      return NextResponse.json(
        { error: "Need to buy refill" },
        { status: 400 }
      );
    }

    const lives = await prisma.lives.findUnique({
      where: { id: user.lives[0].livesId },
    });

    if (!lives) {
      return NextResponse.json(
        { error: "Lives record not found" },
        { status: 404 }
      );
    }

    if (lives.total_lives === 5) {
      return NextResponse.json(
        { error: "No need to use refill" },
        { status: 400 }
      );
    }

    // Update lives and decrement refill count
    const updatedLives = await prisma.lives.update({
      where: { id: lives.id },
      data: {
        last_active_time: new Date(),
        total_lives: 5,
      },
    });

    const updatedRefill = await prisma.refill.update({
      where: { id: userRefill.refillId },
      data: {
        total_refill: { decrement: 1 },
      },
    });

    return NextResponse.json(
      {
        total_lives: updatedLives.total_lives,
        total_refills: updatedRefill.total_refill,
      },
      { status: 201 }
    );
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to update lives or refill" },
      { status: 500 }
    );
  }
}
