import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";
import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import { XP_BY_TYPE } from "@/app/lib/experience-points";

// Get start of day in Sri Lanka time (UTC+5:30)
function getSriLankaDayAnchor(): Date {
  const tz = "Asia/Colombo";
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  const start = startOfDay(zoned);
  return new Date(start.toISOString());
}

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
    const userId = parseInt(decoded.userId);

    // Get user's total XP
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalExperiencePoints: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's XP for today
    const today = getSriLankaDayAnchor();
    const dailyXP = await prisma.experiencePoints.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    return NextResponse.json({
      totalXP: user.totalExperiencePoints,
      dailyXP: dailyXP?.amount || 0,
    });
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to fetch experience points" },
      { status: 500 }
    );
  }
}

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
    const { quizType, isPerfectScore } = await req.json();
    const userId = parseInt(decoded.userId);

    // Validate quiz type
    if (!XP_BY_TYPE[quizType as keyof typeof XP_BY_TYPE]) {
      return NextResponse.json({ error: "Invalid quiz type" }, { status: 400 });
    }

    const today = getSriLankaDayAnchor();

    // Check if user already earned XP today
    const existingXP = await prisma.experiencePoints.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    // Calculate XP to award
    let xpAmount = XP_BY_TYPE[quizType as keyof typeof XP_BY_TYPE];

    // Apply perfect score bonus
    if (isPerfectScore) {
      xpAmount += 5;
    }

    // Apply diminishing returns if not first completion of the day
    if (existingXP) {
      xpAmount = Math.floor(xpAmount * 0.25); // 25% of base XP for subsequent completions
    }

    // Update or create daily XP record and update total XP
    const [dailyXP, updatedUser] = await prisma.$transaction([
      prisma.experiencePoints.upsert({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        create: {
          userId,
          date: today,
          amount: xpAmount,
        },
        update: {
          amount: {
            increment: xpAmount,
          },
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          totalExperiencePoints: {
            increment: xpAmount,
          },
        },
      }),
    ]);

    return NextResponse.json({
      awarded: xpAmount,
      dailyTotal: dailyXP.amount,
      totalXP: updatedUser.totalExperiencePoints,
    });
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to award experience points" },
      { status: 500 }
    );
  }
}
