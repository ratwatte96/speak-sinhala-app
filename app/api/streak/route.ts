import prisma from "../../../lib/prisma";

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
  const streak = await prisma.streak.findUnique({
    where: {
      id: 1,
    },
  });

  let newStreak = streak;
  const lastActiveDate = new Date(streak!.last_active_date);
  if (!isToday(lastActiveDate) && !isYesterday(lastActiveDate)) {
    newStreak = await prisma.streak.update({
      where: {
        id: 1,
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
  const streak = await prisma.streak.findUnique({
    where: {
      id: 1,
    },
  });

  let newStreak = streak;
  if (
    isToday(new Date(streak!.last_active_date)) &&
    streak!.current_streak === 0
  ) {
    newStreak = await prisma.streak.update({
      where: {
        id: 1,
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
        id: 1,
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
