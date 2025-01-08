import prisma from "../../../lib/prisma";

//TODO: need to lock up this endpoint
export async function POST(req: any) {
  const lives = await prisma.lives.findUnique({
    where: {
      id: 1,
    },
  });

  let newLives = lives;
  if (lives?.total_lives === 0) {
    newLives = await prisma.lives.update({
      where: {
        id: 1,
      },
      data: {
        last_active_time: new Date(),
        total_lives: 5,
      },
    });
  }
  return new Response(JSON.stringify(newLives), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
