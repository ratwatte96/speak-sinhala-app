import { verifyAccessToken } from "@/utils/auth";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { access } from "fs";
import { errorWithFile } from "@/utils/logger";

function isToday(date: Date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export async function GET(req: any) {
  const cookies = req.headers.get("cookie");
  if (!cookies) {
    return NextResponse.json({ error: "No cookies found" }, { status: 400 });
  }

  // Parse cookies (basic approach)
  const cookieArray = cookies
    .split("; ")
    .map((cookie: any) => cookie.split("="));
  const cookieMap = Object.fromEntries(cookieArray);

  const accessToken = cookieMap["accessToken"];

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token missing" },
      { status: 401 }
    );
  }

  try {
    const decoded: any = verifyAccessToken(accessToken);
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
    errorWithFile(error);
    return NextResponse.json({ error: "Failed to get lives" }, { status: 500 });
  }
}

export async function POST(req: any) {
  const cookies = req.headers.get("cookie");
  if (!cookies) {
    return NextResponse.json({ error: "No cookies found" }, { status: 400 });
  }

  // Parse cookies (basic approach)
  const cookieArray = cookies
    .split("; ")
    .map((cookie: any) => cookie.split("="));
  const cookieMap = Object.fromEntries(cookieArray);

  const accessToken = cookieMap["accessToken"];

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token missing" },
      { status: 401 }
    );
  }

  try {
    const decoded: any = verifyAccessToken(accessToken);
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
    }
    return new Response(JSON.stringify(newLives), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    errorWithFile(error);
    return NextResponse.json(
      { error: "Failed to update lives" },
      { status: 500 }
    );
  }
}
