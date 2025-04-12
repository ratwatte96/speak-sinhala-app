import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import type { LocalStorageXP, DailyXP } from "@/utils/localStorageXP";

interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
  gender: string;
  streak?: string;
  localXP?: LocalStorageXP;
}

export async function POST(req: Request) {
  const body = (await req.json()) as SignupRequestBody;
  const { username, email, password, gender, streak, localXP } = body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const currentStreak = streak ? parseInt(streak) : 0;

    // Create base transaction operations
    const baseTransactionOperations = [
      // Create User first to get the ID
      prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verificationToken,
          gender,
          totalExperiencePoints: localXP?.totalXP ?? 0,
        },
      }),
      prisma.lives.create({
        data: {
          total_lives: 5,
          last_active_time: new Date(),
        },
      }),
      prisma.streak.create({
        data: {
          current_streak: currentStreak,
          last_active_date: new Date(),
        },
      }),
      prisma.refill.create({
        data: {
          total_refill: 0,
        },
      }),
    ];

    // Execute first transaction to get user and other records
    const [user, lives, streakRecord, refill] = await prisma.$transaction(
      baseTransactionOperations
    );

    // Create XP entries if they exist
    if (localXP?.dailyXP?.length) {
      await prisma.$transaction(
        localXP.dailyXP.map((entry: DailyXP) =>
          prisma.experiencePoints.create({
            data: {
              userId: user.id,
              date: new Date(entry.date),
              amount: entry.amount,
            },
          })
        )
      );
    }

    // Create relationships in a separate transaction
    await prisma.$transaction([
      prisma.livesOnUsers.create({
        data: {
          livesId: lives.id,
          userId: user.id,
        },
      }),
      prisma.streaksOnUsers.create({
        data: {
          streaksId: streakRecord.id,
          userId: user.id,
        },
      }),
      prisma.refillsOnUsers.create({
        data: {
          refillId: refill.id,
          userId: user.id,
        },
      }),
    ]);

    return new Response(
      JSON.stringify({ userId: user.id, verificationToken }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({
        error:
          error.code === "P2002"
            ? "Email already exists"
            : "Failed to create user",
      }),
      { status: 400 }
    );
  }
}
