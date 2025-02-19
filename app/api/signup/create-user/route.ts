import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req: Request) {
  const { username, email, password, streak } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, verificationToken },
    });

    const lives = await prisma.lives.create({
      data: {
        total_lives: 5,
        last_active_time: new Date(),
        users: { create: { user: { connect: { id: user.id } } } },
      },
    });

    const currentStreak = streak ? parseInt(streak) : 0;
    await prisma.streak.create({
      data: {
        current_streak: currentStreak,
        last_active_date: new Date(),
        users: { create: { user: { connect: { id: user.id } } } },
      },
    });

    const refill = await prisma.refill.create({
      data: {
        total_refill: 0,
        users: { create: { user: { connect: { id: user.id } } } },
      },
    });

    return new Response(
      JSON.stringify({ userId: user.id, verificationToken }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "User creation failed" }), {
      status: 500,
    });
  }
}
