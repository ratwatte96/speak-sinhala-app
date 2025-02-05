import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAccessToken } from "@/utils/auth";

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

  //! add try catch
  const decoded: any = verifyAccessToken(accessToken);
  const user: any = await prisma.user.findUnique({
    where: {
      id: parseInt(decoded.userId),
    },
    include: {
      refills: true,
    },
  });
  const refill = await prisma.refill.findUnique({
    where: {
      id: user.refills[0].refillId,
    },
  });

  return new Response(JSON.stringify(refill), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// TODO: Secure this endpoint properly
export async function POST(req: Request) {
  try {
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

    const decoded: any = verifyAccessToken(accessToken);
    if (decoded.isPremium) {
      return NextResponse.json(
        { error: "The user is premium" },
        { status: 401 }
      );
    }

    // Fetch user with lives and refills
    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) },
      include: { lives: true, refills: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure user has a refill record
    const userRefill: any = user.refills.length > 0 ? user.refills[0] : null;

    if (!userRefill || userRefill.total_refill === 0) {
      return NextResponse.json(
        { error: "Need to buy refill" },
        { status: 400 }
      );
    }

    // Fetch user's lives record
    const lives = await prisma.lives.findUnique({
      where: { id: user.lives[0].livesId },
    });

    if (!lives) {
      return NextResponse.json(
        { error: "Lives record not found" },
        { status: 404 }
      );
    }

    // Update lives if needed
    let updatedLives = lives;
    if (lives.total_lives !== 5) {
      updatedLives = await prisma.lives.update({
        where: { id: lives.id },
        data: {
          last_active_time: new Date(),
          total_lives: 5,
        },
      });

      // Decrease total_refill by 1
      await prisma.refill.update({
        where: { id: userRefill.refillId },
        data: {
          total_refill: { decrement: 1 },
        },
      });
    } else {
      return NextResponse.json(
        { error: "No need to use refill" },
        { status: 400 }
      );
    }

    return new Response(JSON.stringify(updatedLives), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating lives/refill:", error);
    return NextResponse.json(
      { error: "Failed to update lives or refill" },
      { status: 500 }
    );
  }
}
