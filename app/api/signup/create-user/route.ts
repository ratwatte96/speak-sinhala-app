import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req: Request) {
  const { username, email, password, streak } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const currentStreak = streak ? parseInt(streak) : 0;

    // Perform all operations in a single transaction
    const [user, lives, streakRecord, refill] = await prisma.$transaction([
      // Create User
      prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verificationToken,
        },
      }),

      // Create Lives
      prisma.lives.create({
        data: {
          total_lives: 5,
          last_active_time: new Date(),
        },
      }),

      // Create Streak
      prisma.streak.create({
        data: {
          current_streak: currentStreak,
          last_active_date: new Date(),
        },
      }),

      // Create Refill
      prisma.refill.create({
        data: {
          total_refill: 0,
        },
      }),
    ]);

    // Associate User with Lives, Streak, and Refill in a single batch insert
    await prisma.$transaction([
      prisma.livesOnUsers.create({
        data: { userId: user.id, livesId: lives.id },
      }),
      prisma.streaksOnUsers.create({
        data: { userId: user.id, streaksId: streakRecord.id },
      }),
      prisma.refillsOnUsers.create({
        data: { userId: user.id, refillId: refill.id },
      }),
    ]);

    return new Response(
      JSON.stringify({ userId: user.id, verificationToken }),
      { status: 201 }
    );
  } catch (error) {
    console.error("User creation failed:", error);
    return new Response(JSON.stringify({ error: "User creation failed" }), {
      status: 500,
    });
  }
}
