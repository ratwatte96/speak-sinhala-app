"use client";

import { useUnifiedXP } from "../app/lib/experience-points/hooks";
import { XPErrorBoundary } from "./XPErrorBoundary";
import { Trophy } from "lucide-react";

interface XPStatsProps {
  isLoggedIn?: boolean;
}

export default function XPStats({ isLoggedIn = false }: XPStatsProps) {
  const { xpData, isLoading, error } = useUnifiedXP(isLoggedIn);

  const content = (
    <div className="flex justify-between mt-4 bg-gray-300 dark:bg-black dark-base-border dark:border-gray-600 p-4 rounded-md">
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">Experience Points</span>
        <span className="text-xs text-gray-500">
          Track your learning progress
        </span>
        {isLoggedIn && xpData.dailyRank !== null && (
          <div className="flex items-center gap-1 mt-1">
            <Trophy size={12} className="text-yellow-500" />
            <span className="text-xs text-gray-500">
              #{xpData.dailyRank} Today
            </span>
          </div>
        )}
        {isLoggedIn && xpData.allTimeRank !== null && (
          <div className="flex items-center gap-1">
            <Trophy size={12} className="text-purple-500" />
            <span className="text-xs text-gray-500">
              #{xpData.allTimeRank} All-Time
            </span>
          </div>
        )}
      </div>
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
  );

  return <XPErrorBoundary>{content}</XPErrorBoundary>;
}
