import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";

interface DecodedToken {
  userId: string;
  [key: string]: any;
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
    const { achievementId } = await req.json();

    // Get the achievement and user's progress
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
      include: {
        users: {
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

    const userAchievement = achievement.users[0];
    if (!userAchievement) {
      return NextResponse.json(
        { error: "Achievement not unlocked" },
        { status: 400 }
      );
    }

    if (!userAchievement.completed) {
      return NextResponse.json(
        { error: "Achievement not completed" },
        { status: 400 }
      );
    }

    if (userAchievement.claimed) {
      return NextResponse.json(
        { error: "Achievement already claimed" },
        { status: 400 }
      );
    }

    // Get user's current lives
    const userLives = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        lives: true,
      },
    });

    if (!userLives || !userLives.lives[0]) {
      return NextResponse.json(
        { error: "User lives not found" },
        { status: 404 }
      );
    }

    // Update achievement claim status and award hearts in a transaction
    const [updatedAchievement, updatedLives] = await prisma.$transaction([
      prisma.userAchievement.update({
        where: {
          userId_achievementId: {
            userId,
            achievementId,
          },
        },
        data: {
          claimed: true,
          claimedAt: new Date(),
          heartsAwarded: achievement.heartReward,
        },
      }),
      prisma.lives.update({
        where: { id: userLives.lives[0].livesId },
        data: {
          total_lives: {
            increment: achievement.heartReward,
          },
          last_active_time: new Date(),
        },
      }),
    ]);

    return NextResponse.json({
      claimed: true,
      heartsAwarded: achievement.heartReward,
      totalLives: updatedLives.total_lives,
    });
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to claim achievement" },
      { status: 500 }
    );
  }
}
