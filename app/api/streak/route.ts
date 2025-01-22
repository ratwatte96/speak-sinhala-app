import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyRefreshToken } from "@/utils/auth";

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

  const refreshToken = cookieMap["refreshToken"];

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token missing" },
      { status: 401 }
    );
  }

  //! add try catch
  const decoded: any = verifyRefreshToken(refreshToken); // Verify refresh token
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
  }

  return new Response(JSON.stringify(newStreak), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
