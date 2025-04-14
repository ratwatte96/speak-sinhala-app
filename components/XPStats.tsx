"use client";

import { useUnifiedXP } from "../app/lib/experience-points/hooks";
import { XPErrorBoundary } from "./XPErrorBoundary";
import { Trophy, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface XPStatsProps {
  isLoggedIn?: boolean;
}

export default function XPStats({ isLoggedIn = false }: XPStatsProps) {
  const { xpData, isLoading, error } = useUnifiedXP(isLoggedIn);
  const router = useRouter();

  const content = (
    <div className="flex justify-between mt-4 bg-gray-300 dark:bg-black dark-base-border dark:border-gray-600 p-4 rounded-md">
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">Experience Points</span>
        <span className="text-xs text-gray-500">
          Track your learning progress
        </span>
        <div className="flex flex-row gap-2 mt-2">
          <div>
            {isLoggedIn && xpData.dailyRank !== null && (
              <div className="flex items-center gap-1">
                <Trophy size={16} className="text-yellow-500" />
                <span className="text-sm text-gray-500">
                  #{xpData.dailyRank} Today
                </span>
              </div>
            )}
            {isLoggedIn && xpData.allTimeRank !== null && (
              <div className="flex items-center gap-1">
                <Trophy size={16} className="text-purple-500" />
                <span className="text-sm text-gray-500">
                  #{xpData.allTimeRank} All-Time
                </span>
              </div>
            )}
          </div>
          {isLoggedIn && (
            <button
              onClick={() => router.push("/leaderboard")}
              className="flex items-end gap-0.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="View Leaderboard"
            >
              <span className="underline">View Leaderboard</span>
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          {error ? (
            <div className="text-xs text-red-500">Error loading XP</div>
          ) : (
            <>
              <span className="text-lg font-bold text-yellow-500">
                {xpData.totalXP} XP
              </span>
              <span className="text-xs text-gray-500">
                Today: {isLoading ? "..." : `${xpData.dailyXP} XP`}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return <XPErrorBoundary>{content}</XPErrorBoundary>;
}
