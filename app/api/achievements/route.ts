import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";

interface DecodedToken {
  userId: string;
  [key: string]: any;
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

    // Get all achievements with user's progress and completion status
    const achievements = await prisma.achievement.findMany({
      include: {
        users: {
          where: { userId },
          select: {
            completed: true,
            claimed: true,
            completedAt: true,
            claimedAt: true,
            heartsAwarded: true,
          },
        },
        progress: {
          where: { userId },
          select: {
            currentValue: true,
            targetValue: true,
            lastUpdated: true,
            lastReset: true,
          },
        },
      },
    });

    // Format the response
    const formattedAchievements = achievements.map((achievement) => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      type: achievement.type,
      heartReward: achievement.heartReward,
      requirement: achievement.requirement,
      resetType: achievement.resetType,
      userProgress: {
        completed: achievement.users[0]?.completed ?? false,
        claimed: achievement.users[0]?.claimed ?? false,
        completedAt: achievement.users[0]?.completedAt ?? null,
        claimedAt: achievement.users[0]?.claimedAt ?? null,
        heartsAwarded: achievement.users[0]?.heartsAwarded ?? 0,
        currentValue: achievement.progress[0]?.currentValue ?? 0,
        targetValue:
          achievement.progress[0]?.targetValue ?? achievement.requirement,
        lastUpdated: achievement.progress[0]?.lastUpdated ?? null,
        lastReset: achievement.progress[0]?.lastReset ?? null,
      },
    }));

    return NextResponse.json(formattedAchievements);
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
