import prisma from "../../../lib/prisma";

function isToday(date: Date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export async function GET(req: any) {
  const lives = await prisma.lives.findUnique({
    where: {
      id: 1,
    },
  });

  let newLives = lives;
  if (!isToday(new Date(lives!.last_active_time))) {
    newLives = await prisma.lives.update({
      where: {
        id: 1,
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
