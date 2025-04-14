import { NextResponse } from "next/server";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";
import { getLeaderboardData } from "@/app/lib/leaderboard/service";

interface DecodedToken {
  userId: string;
  [key: string]: any;
}

export async function GET(req: Request) {
  const accessToken = extractAccessToken(req);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token missing" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const decoded = verifyAccessToken(accessToken) as DecodedToken;
    const userId = parseInt(decoded.userId);

    const leaderboardData = await getLeaderboardData(
      "daily",
      page,
      pageSize,
      userId
    );

    return NextResponse.json(leaderboardData);
  } catch (error) {
    errorWithFile(error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}
