import { NextResponse } from "next/server";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";
import { updateRankings, getUserRank } from "@/app/lib/leaderboard/service";

interface DecodedToken {
  userId: string;
  [key: string]: any;
}

export async function POST(req: Request) {
  const accessToken = extractAccessToken(req);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token missing" },
      { status: 401 }
    );
  }

  try {
    const decoded = verifyAccessToken(accessToken) as DecodedToken;
    const userId = parseInt(decoded.userId);

    // Update both daily and all-time rankings
    await Promise.all([updateRankings("daily"), updateRankings("allTime")]);

    // Get updated ranks for the user
    const [dailyRank, allTimeRank] = await Promise.all([
      getUserRank(userId, "daily"),
      getUserRank(userId, "allTime"),
    ]);

    return NextResponse.json({
      dailyRank,
      allTimeRank,
      message: "Rankings updated successfully",
    });
  } catch (error) {
    errorWithFile(error);
    return NextResponse.json(
      { error: "Failed to update rankings" },
      { status: 500 }
    );
  }
}
