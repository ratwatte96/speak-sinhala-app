import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { errorWithFile } from "@/utils/logger";
import { checkAchievements } from "@/app/lib/achievements/service";

function isToday(date: Date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
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
        lives: true,
      },
    });
    const lives = await prisma.lives.findUnique({
      where: {
        id: user.lives[0].livesId,
      },
    });

    let newLives: any = lives;
    if (!isToday(new Date(lives!.last_active_time))) {
      newLives = await prisma.lives.update({
        where: {
          id: newLives.id,
        },
        data: { last_active_time: new Date(), total_lives: 5 },
      });
    }

    return new Response(JSON.stringify(newLives), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json({ error: "Failed to get lives" }, { status: 500 });
  }
}

export async function POST(req: any) {
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
        lives: true,
      },
    });

    const lives = await prisma.lives.findUnique({
      where: {
        id: user.lives[0].livesId,
      },
    });

    let newLives: any = lives;
    if (lives?.total_lives !== 0) {
      newLives = await prisma.lives.update({
        where: {
          id: newLives.id,
        },
        data: {
          last_active_time: new Date(),
          total_lives: lives!.total_lives - 1,
        },
      });

      // Check achievements after lives are updated
      const achievementResults = await checkAchievements(
        parseInt(decoded.userId)
      );

      return new Response(
        JSON.stringify({
          ...newLives,
          achievements: achievementResults,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(JSON.stringify(newLives), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to update lives" },
      { status: 500 }
    );
  }
}
