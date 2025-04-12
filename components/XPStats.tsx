"use client";

import { useUnifiedXP } from "../app/lib/experience-points/hooks";

interface XPStatsProps {
  isLoggedIn?: boolean;
}

export default function XPStats({ isLoggedIn = false }: XPStatsProps) {
  const { xpData, isLoading, error } = useUnifiedXP(isLoggedIn);

  return (
    <div className="flex justify-between mt-4 bg-gray-300 dark:bg-black dark-base-border dark:border-gray-600 p-4 rounded-md">
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">Experience Points</span>
        <span className="text-xs text-gray-500">
          Track your learning progress
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-lg font-bold text-yellow-500">
          {xpData.totalXP} XP
        </span>
        <span className="text-xs text-gray-500">
          Today: {isLoading ? "..." : `${xpData.dailyXP} XP`}
          {error && <span className="text-red-500 ml-1">!</span>}
        </span>
      </div>
    </div>
  );
}
