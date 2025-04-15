import prisma from "@/lib/prisma";
import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import {
  AchievementCheckResult,
  AchievementServiceResponse,
  DailyResetResult,
  AchievementProgressUpdate,
  AchievementRewardClaim,
} from "./types";

// Helper to get Sri Lanka day anchor - matching the server implementation
const getSriLankaDayAnchor = (): Date => {
  const tz = "Asia/Colombo";
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  const start = startOfDay(zoned);
  return new Date(start.toISOString());
};

export async function checkAchievements(
  userId: number
): Promise<AchievementServiceResponse> {
  const results: AchievementCheckResult[] = [];
  let totalHeartsAwarded = 0;

  // Get user's achievements and progress
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });

  const achievementProgress = await prisma.achievementProgress.findMany({
    where: { userId },
    include: { achievement: true },
  });

  // Process each achievement
  for (const progress of achievementProgress) {
    const userAchievement = userAchievements.find(
      (ua) => ua.achievementId === progress.achievementId
    );

    if (
      progress.currentValue >= progress.targetValue &&
      !userAchievement?.completed
    ) {
      // Mark achievement as completed
      await prisma.userAchievement.update({
        where: {
          userId_achievementId: {
            userId,
            achievementId: progress.achievementId,
          },
        },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });

      results.push({
        completed: true,
        progress: progress.currentValue,
        achievementId: progress.achievementId,
      });

      // Award hearts if not claimed yet
      if (!userAchievement?.claimed) {
        totalHeartsAwarded += progress.achievement.heartReward;
      }
    } else {
      results.push({
        completed: false,
        progress: progress.currentValue,
        achievementId: progress.achievementId,
      });
    }
  }

  return {
    achievements: results,
    heartsAwarded: totalHeartsAwarded,
  };
}

export async function updateProgress(
  data: AchievementProgressUpdate
): Promise<void> {
  await prisma.achievementProgress.upsert({
    where: {
      userId_achievementId: {
        userId: data.userId,
        achievementId: data.achievementId,
      },
    },
    create: {
      userId: data.userId,
      achievementId: data.achievementId,
      currentValue: data.currentValue,
      targetValue: data.targetValue,
      lastUpdated: new Date(),
    },
    update: {
      currentValue: data.currentValue,
      lastUpdated: new Date(),
    },
  });
}

export async function claimReward(data: AchievementRewardClaim): Promise<void> {
  // Start a transaction to ensure data consistency
  await prisma.$transaction(async (tx) => {
    // Update achievement claim status
    await tx.userAchievement.update({
      where: {
        userId_achievementId: {
          userId: data.userId,
          achievementId: data.achievementId,
        },
      },
      data: {
        claimed: true,
        claimedAt: new Date(),
        heartsAwarded: data.heartsAwarded,
      },
    });

    // Get user's current lives
    const userLives = await tx.livesOnUsers.findFirst({
      where: { userId: data.userId },
      include: { live: true },
    });

    if (!userLives) {
      throw new Error("User lives not found");
    }

    // Update lives balance
    await tx.lives.update({
      where: { id: userLives.livesId },
      data: {
        total_lives: userLives.live.total_lives + data.heartsAwarded,
        last_active_time: new Date(),
      },
    });
  });
}

export async function handleDailyReset(): Promise<DailyResetResult> {
  const resetAchievements: number[] = [];
  const resetProgress: number[] = [];

  // Get all daily achievements
  const dailyAchievements = await prisma.achievement.findMany({
    where: { resetType: "daily" },
  });

  // Reset progress for daily achievements
  for (const achievement of dailyAchievements) {
    // Reset progress
    await prisma.achievementProgress.updateMany({
      where: { achievementId: achievement.id },
      data: {
        currentValue: 0,
        lastReset: getSriLankaDayAnchor(),
      },
    });

    // Reset completion status
    await prisma.userAchievement.updateMany({
      where: {
        achievementId: achievement.id,
        completed: true,
      },
      data: {
        completed: false,
        completedAt: null,
        claimed: false,
        claimedAt: null,
        heartsAwarded: 0,
      },
    });

    resetAchievements.push(achievement.id);
    resetProgress.push(achievement.id);
  }

  return {
    resetAchievements,
    resetProgress,
  };
}
