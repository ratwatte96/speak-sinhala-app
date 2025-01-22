import { sendEmail } from "@/utils/email";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: any) {
  const { email, password } = await req.json();

  // Validate email and password
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email format" }), {
      status: 400,
    });
  }

  // Validate password strength
  if (password.length < 8) {
    return new Response(
      JSON.stringify({ error: "Password must be at least 8 characters long" }),
      { status: 400 }
    );
  }
  if (!/[A-Z]/.test(password)) {
    return new Response(
      JSON.stringify({
        error: "Password must contain at least one uppercase letter",
      }),
      { status: 400 }
    );
  }
  if (!/[0-9]/.test(password)) {
    return new Response(
      JSON.stringify({ error: "Password must contain at least one number" }),
      { status: 400 }
    );
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return new Response(
      JSON.stringify({
        error: "Password must contain at least one special character",
      }),
      { status: 400 }
    );
  }

  try {
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already taken" }), {
        status: 409,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Save the user to the database
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, verificationToken },
    });

    const lives = await prisma.lives.create({
      data: { total_lives: 5, last_active_time: new Date() },
    });

    const connectLives = await prisma.lives.update({
      where: {
        id: lives.id,
      },
      data: {
        users: {
          create: {
            user: {
              connect: { id: user.id },
            },
          },
        },
      },
    });

    const streak = await prisma.streak.create({
      data: { current_streak: 0, last_active_date: new Date() },
    });

    const connectStreak = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        streaks: {
          create: {
            streak: {
              connect: { id: streak.id },
            },
          },
        },
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.API_URL}/api/verify?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Click this link to verify your email: ${verificationUrl}`,
    });

    const dailyUserCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Count emails from today
        },
      },
    });
    if (dailyUserCount === 90) {
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: "Speak Sinhala: Email Limit",
        text: ``,
      });
    }

    return new Response(
      JSON.stringify({ message: "User created. Verification email sent." }),
      { status: 201 }
    );
  } catch (error: any) {
    if (error.responseCode === 452) {
      console.error("Daily limit reached.");
      const autoverify = await prisma.user.updateMany({
        where: { email },
        data: { isVerified: true },
      });
      return new Response(JSON.stringify({ message: "User created." }), {
        status: 201,
      });
    } else {
      console.error("Error sending email:", error.message);
    }
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
