import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { errorWithFile } from "@/utils/logger";

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

  try {
    const decoded: any = verifyAccessToken(accessToken);
    const isPremium = await updatePremiumStatus(parseInt(decoded.userId));
    if (isPremium) {
      return NextResponse.json(
        { error: "The user is premium" },
        { status: 401 }
      );
    }

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

    return NextResponse.json(refill, { status: 200 });
  } catch (error) {
    errorWithFile("Error updating refill:", error);
    return NextResponse.json(
      { error: "Failed to update refill" },
      { status: 500 }
    );
  }
}
