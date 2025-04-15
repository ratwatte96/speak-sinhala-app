import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";
import {
  updateProgress,
  checkAchievements,
} from "@/app/lib/achievements/service";
import type { AchievementServiceResponse } from "@/app/lib/achievements/types";

//!Refactor

function isToday(date: Date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isYesterday(date: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export async function GET(req: any) {
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
    const user: any = await prisma.user.findUnique({
      where: {
        id: parseInt(decoded.userId),
      },
      include: {
        streaks: true,
      },
    });

    const streak = await prisma.streak.findUnique({
      where: {
        id: user.streaks[0].streaksId,
      },
    });

    let newStreak: any = streak;
    const lastActiveDate = new Date(streak!.last_active_date);
    if (!isToday(lastActiveDate) && !isYesterday(lastActiveDate)) {
      newStreak = await prisma.streak.update({
        where: {
          id: newStreak.id,
        },
        data: { last_active_date: new Date(), current_streak: 0 },
      });
    }

    return new Response(JSON.stringify(newStreak), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to get streak" },
      { status: 500 }
    );
  }
}

export async function POST(req: any) {
  const accessToken = extractAccessToken(req);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Refresh token missing" },
      { status: 401 }
    );
  }

  let decoded: any;
  try {
    decoded = verifyAccessToken(accessToken);
    const user: any = await prisma.user.findUnique({
      where: {
        id: parseInt(decoded.userId),
      },
      include: {
        streaks: true,
      },
    });
    const streak = await prisma.streak.findUnique({
      where: {
        id: user.streaks[0].streaksId,
      },
    });

    let newStreak: any = streak;
    let achievementResults: AchievementServiceResponse | undefined;

    if (
      isToday(new Date(streak!.last_active_date)) &&
      streak!.current_streak === 0
    ) {
      newStreak = await prisma.streak.update({
        where: {
          id: newStreak.id,
        },
        data: {
          last_active_date: new Date(),
          current_streak: streak!.current_streak + 1,
        },
      });
    }

    if (isYesterday(new Date(streak!.last_active_date))) {
      newStreak = await prisma.streak.update({
        where: {
          id: newStreak.id,
        },
        data: {
          last_active_date: new Date(),
          current_streak: streak!.current_streak + 1,
        },
      });

      // Update streak milestone achievements
      const streakAchievements = await prisma.achievement.findMany({
        where: {
          type: "streak",
        },
      });

      for (const achievement of streakAchievements) {
        await updateProgress({
          userId: parseInt(decoded.userId),
          achievementId: achievement.id,
          currentValue: newStreak.current_streak,
          targetValue: achievement.requirement,
        });
      }

      // Check achievements and award hearts if needed
      achievementResults = await checkAchievements(parseInt(decoded.userId));
    }

    return new Response(
      JSON.stringify({
        ...newStreak,
        achievements: achievementResults,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to update streak" },
      { status: 500 }
    );
  }
}
