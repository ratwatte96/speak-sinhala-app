import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import prisma from "@/lib/prisma";
import { LeaderboardType, LeaderboardData } from "./types";

// Get start of day in Sri Lanka time (UTC+5:30)
export function getSriLankaDayAnchor(): Date {
  const tz = "Asia/Colombo";
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  const start = startOfDay(zoned);
  return new Date(
    Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0)
  );
}

// Core leaderboard functions
export async function updateRankings(type: LeaderboardType): Promise<void> {
  const today = getSriLankaDayAnchor();

  // Get or create leaderboard for the specified type and date
  const leaderboard = await prisma.leaderboard.upsert({
    where: {
      type_date: {
        type,
        date: type === "daily" ? today : new Date(0), // Use epoch for all-time
      },
    },
    create: {
      type,
      date: type === "daily" ? today : new Date(0),
    },
    update: {},
  });

  // Get user scores based on leaderboard type
  const userScores = await prisma.user.findMany({
    select: {
      id: true,
      totalExperiencePoints: true,
      experiencePoints: {
        where: type === "daily" ? { date: today } : undefined,
        select: { amount: true },
      },
    },
  });

  // Calculate rankings
  const rankings = userScores
    .map((user) => ({
      userId: user.id,
      score:
        type === "daily"
          ? user.experiencePoints[0]?.amount ?? 0
          : user.totalExperiencePoints,
    }))
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  // Update leaderboard entries in a transaction
  await prisma.$transaction(
    rankings.map((entry) =>
      prisma.leaderboardEntry.upsert({
        where: {
          userId_leaderboardId: {
            userId: entry.userId,
            leaderboardId: leaderboard.id,
          },
        },
        create: {
          userId: entry.userId,
          leaderboardId: leaderboard.id,
          rank: entry.rank,
          score: entry.score,
        },
        update: {
          rank: entry.rank,
          score: entry.score,
        },
      })
    )
  );
}

export async function getUserRank(
  userId: number,
  type: LeaderboardType
): Promise<number | null> {
  const today = getSriLankaDayAnchor();

  const entry = await prisma.leaderboardEntry.findFirst({
    where: {
      userId,
      leaderboard: {
        type,
        date: type === "daily" ? today : new Date(0),
      },
    },
    select: { rank: true },
  });

  return entry?.rank ?? null;
}

export async function getLeaderboardData(
  type: LeaderboardType,
  page: number = 1,
  pageSize: number = 10,
  userId?: number
): Promise<LeaderboardData> {
  const today = getSriLankaDayAnchor();

  // Get leaderboard entries for the current page
  const entries = await prisma.leaderboardEntry.findMany({
    where: {
      leaderboard: {
        type,
        date: type === "daily" ? today : new Date(0),
      },
    },
    select: {
      userId: true,
      rank: true,
      score: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: { rank: "asc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  // Get total number of participants
  const totalParticipants = await prisma.leaderboardEntry.count({
    where: {
      leaderboard: {
        type,
        date: type === "daily" ? today : new Date(0),
      },
    },
  });

  // Get user's rank if userId is provided
  let userRank: number | undefined;
  if (userId) {
    userRank = (await getUserRank(userId, type)) ?? undefined;
  }

  return {
    entries: entries.map((entry) => ({
      userId: entry.userId,
      username: entry.user.username,
      rank: entry.rank,
      score: entry.score,
    })),
    userRank,
    totalParticipants,
  };
}

// Function to handle daily leaderboard reset
export async function handleDailyReset(): Promise<void> {
  const today = getSriLankaDayAnchor();

  // Create new daily leaderboard if it doesn't exist
  await prisma.leaderboard.upsert({
    where: {
      type_date: {
        type: "daily",
        date: today,
      },
    },
    create: {
      type: "daily",
      date: today,
    },
    update: {},
  });

  // Update rankings for both daily and all-time leaderboards
  await Promise.all([updateRankings("daily"), updateRankings("allTime")]);
}
