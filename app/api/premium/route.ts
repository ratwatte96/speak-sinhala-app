import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";

export async function POST(req: NextRequest) {
  const accessToken = extractAccessToken(req);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token missing" },
      { status: 401 }
    );
  }

  let decoded: any;
  try {
    decoded = verifyAccessToken(accessToken);

    const { type } = await req.json();
    if (!["1_month", "12_months", "lifetime"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid subscription type" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isPremium) {
      return NextResponse.json(
        { error: "The user is premium" },
        { status: 401 }
      );
    }

    let premiumEndDate = null;
    if (type === "1_month")
      premiumEndDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    if (type === "12_months")
      premiumEndDate = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPremium: true,
        premiumEndDate,
      },
    });

    return NextResponse.json({ message: "Premium activated successfully" });
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to update premium status" },
      { status: 500 }
    );
  }
}
