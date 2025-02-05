import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAccessToken } from "@/utils/auth";

export async function POST(req: Request) {
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
    return NextResponse.json({ error: "The user is premium" }, { status: 401 });
  }

  try {
    const { newTotal } = await req.json();

    if (typeof newTotal !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Find the user along with their existing refills
    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) },
      include: { refills: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let refill;

    // If the user doesn't have a refill record, create one
    if (user.refills.length === 0) {
      refill = await prisma.refill.create({
        data: {
          total_refill: newTotal, // Start with the provided amount
          users: {
            create: {
              userId: user.id, // Associate the user with the refill
            },
          },
        },
      });
    } else {
      // Get the user's first refill
      const existingRefillId = user.refills[0].refillId;

      // Update the existing refill
      refill = await prisma.refill.update({
        where: { id: existingRefillId },
        data: {
          total_refill: {
            increment: newTotal, // Add to the existing count
          },
        },
      });
    }

    return NextResponse.json(refill, { status: 200 });
  } catch (error) {
    console.error("Error updating refill:", error);
    return NextResponse.json(
      { error: "Failed to update refill" },
      { status: 500 }
    );
  }
}
