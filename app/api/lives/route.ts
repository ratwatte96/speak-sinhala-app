import { verifyRefreshToken } from "@/utils/auth";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

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

  const refreshToken = cookieMap["refreshToken"];

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token missing" },
      { status: 401 }
    );
  }

  //! add try catch
  const decoded: any = verifyRefreshToken(refreshToken); // Verify refresh token
  console.log("decoded", decoded);
  const user: any = await prisma.user.findUnique({
    where: {
      id: parseInt(decoded.userId),
    },
    include: {
      lives: true,
    },
  });
  console.log("user", user);

  const lives = await prisma.lives.findUnique({
    where: {
      id: user.lives[0].livesId,
    },
  });
  console.log("lives", lives);

  let newLives = lives;
  if (!isToday(new Date(lives!.last_active_time))) {
    newLives = await prisma.lives.update({
      where: {
        id: user.id,
      },
      data: { last_active_time: new Date(), total_lives: 5 },
    });
  }

  return new Response(JSON.stringify(newLives), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: any) {
  const lives = await prisma.lives.findUnique({
    where: {
      id: 1,
    },
  });

  let newLives = lives;
  if (lives?.total_lives !== 0) {
    newLives = await prisma.lives.update({
      where: {
        id: 1,
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
}
