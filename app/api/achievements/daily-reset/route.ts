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
    const today = getSriLankaDayAnchor();

    // Get all daily achievements for the user
    const dailyAchievements = await prisma.achievement.findMany({
      where: {
        resetType: "daily",
      },
      include: {
        progress: {
          where: { userId },
        },
        users: {
          where: { userId },
        },
      },
    });

    // Reset progress for each daily achievement that hasn't been reset today
    const resetPromises = dailyAchievements.map(async (achievement) => {
      const userProgress = achievement.progress[0];
      const userAchievement = achievement.users[0];

      if (
        !userProgress ||
        !userProgress.lastReset ||
        userProgress.lastReset < today
      ) {
        // Reset progress
        await prisma.achievementProgress.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id,
            },
          },
          create: {
            userId,
            achievementId: achievement.id,
            currentValue: 0,
            targetValue: achievement.requirement,
            lastReset: today,
            lastUpdated: new Date(),
          },
          update: {
            currentValue: 0,
            lastReset: today,
            lastUpdated: new Date(),
          },
        });

        // If achievement was completed, mark it as uncompleted
        if (userAchievement?.completed && !userAchievement.claimed) {
          await prisma.userAchievement.update({
            where: {
              userId_achievementId: {
                userId,
                achievementId: achievement.id,
              },
            },
            data: {
              completed: false,
              completedAt: null,
            },
          });
        }
      }
    });

    await Promise.all(resetPromises);

    return NextResponse.json({
      message: "Daily achievements reset successfully",
      resetTime: today,
    });
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to reset daily achievements" },
      { status: 500 }
    );
  }
}
