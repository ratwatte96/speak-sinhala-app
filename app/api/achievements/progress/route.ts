import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";
import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";

interface DecodedToken {
  userId: string;
  [key: string]: any;
}

// Get start of day in Sri Lanka time (UTC+5:30)
function getSriLankaDayAnchor(): Date {
  const tz = "Asia/Colombo";
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  const start = startOfDay(zoned);
  return new Date(
    Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0)
  );
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

    // Get all achievement progress for the user
    const progress = await prisma.achievementProgress.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to fetch achievement progress" },
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
    const userId = parseInt(decoded.userId);
    const { achievementId, progressValue } = await req.json();

    // Get the achievement
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
      include: {
        users: {
          where: { userId },
        },
        progress: {
          where: { userId },
        },
      },
    });

    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    const today = getSriLankaDayAnchor();
    const userProgress = achievement.progress[0];
    const userAchievement = achievement.users[0];

    // For daily achievements, check if we need to reset progress
    if (achievement.resetType === "daily" && userProgress) {
      const lastReset = userProgress.lastReset;
      if (!lastReset || lastReset < today) {
        // Reset progress for new day
        await prisma.achievementProgress.update({
          where: {
            userId_achievementId: {
              userId,
              achievementId,
            },
          },
          data: {
            currentValue: progressValue,
            lastReset: today,
            lastUpdated: new Date(),
          },
        });
        return NextResponse.json({
          currentValue: progressValue,
          wasReset: true,
        });
      }
    }

    // Update or create progress
    const updatedProgress = await prisma.achievementProgress.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
      create: {
        userId,
        achievementId,
        currentValue: progressValue,
        targetValue: achievement.requirement,
        lastUpdated: new Date(),
        lastReset: achievement.resetType === "daily" ? today : null,
      },
      update: {
        currentValue: progressValue,
        lastUpdated: new Date(),
      },
    });

    // Check if achievement should be completed
    if (
      progressValue >= achievement.requirement &&
      !userAchievement?.completed
    ) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId,
          },
        },
        create: {
          userId,
          achievementId,
          completed: true,
          completedAt: new Date(),
        },
        update: {
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json(updatedProgress);
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to update achievement progress" },
      { status: 500 }
    );
  }
}
