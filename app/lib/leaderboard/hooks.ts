import { useState, useEffect, useCallback } from "react";
import { fetchWithToken } from "@/utils/fetch";
import { errorWithFile } from "@/utils/logger";
import { useSharedState } from "@/components/StateProvider";
import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";

// Types
interface LeaderboardEntry {
  userId: number;
  username: string;
  score: number;
  rank: number;
}

interface LeaderboardData {
  daily: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
  userRank: {
    daily: number | null;
    allTime: number | null;
  };
}

interface UseLeaderboardReturn {
  leaderboardData: LeaderboardData;
  isLoading: boolean;
  error: string | null;
  refreshLeaderboard: () => Promise<void>;
}

// Helper to get Sri Lanka day anchor
const getSriLankaDayAnchor = (): Date => {
  const tz = "Asia/Colombo";
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  const start = startOfDay(zoned);
  return new Date(start.toISOString());
};

// Main leaderboard hook
export const useLeaderboard = (): UseLeaderboardReturn => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({
    daily: [],
    allTime: [],
    userRank: {
      daily: null,
      allTime: null,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSharedState } = useSharedState();

  const fetchLeaderboardData = async () => {
    try {
      const [dailyResponse, allTimeResponse] = await Promise.all([
        fetchWithToken("/api/leaderboard/daily"),
        fetchWithToken("/api/leaderboard/all-time"),
      ]);

      const dailyData = await dailyResponse.json();
      const allTimeData = await allTimeResponse.json();

      if (!dailyResponse.ok || !allTimeResponse.ok) {
        throw new Error(
          dailyData.error ||
            allTimeData.error ||
            "Failed to fetch leaderboard data"
        );
      }

      setLeaderboardData({
        daily: dailyData.entries,
        allTime: allTimeData.entries,
        userRank: {
          daily: dailyData.userRank,
          allTime: allTimeData.userRank,
        },
      });

      // Update shared state with rank information
      setSharedState("leaderboard", {
        dailyRank: dailyData.userRank,
        allTimeRank: allTimeData.userRank,
      });

      setError(null);
    } catch (err: any) {
      errorWithFile(err);
      setError(err.message || "Failed to fetch leaderboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  return {
    leaderboardData,
    isLoading,
    error,
    refreshLeaderboard: fetchLeaderboardData,
  };
};

// Hook for user rank
export const useUserRank = () => {
  const { sharedState } = useSharedState();

  return {
    dailyRank: sharedState.leaderboard?.dailyRank ?? null,
    allTimeRank: sharedState.leaderboard?.allTimeRank ?? null,
  };
};
