"use client";

import { PERFECT_SCORE_BONUS } from "../app/lib/experience-points/index";
import { useUnifiedXP } from "../app/lib/experience-points/hooks";
import { XPErrorBoundary } from "./XPErrorBoundary";

interface XPDisplayProps {
  xpEarned: number;
  dailyTotal: number;
  isPerfect?: boolean;
  isLoggedIn?: boolean;
}

export default function XPDisplay({
  xpEarned,
  dailyTotal,
  isPerfect = false,
  isLoggedIn = false,
}: XPDisplayProps) {
  const { xpData, isLoading, error } = useUnifiedXP(isLoggedIn);
  const perfectBonus = isPerfect ? PERFECT_SCORE_BONUS : 0;
  const totalXP = xpEarned + perfectBonus;

  const content = (
    <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      ) : error ? (
        <div className="text-sm text-red-600 dark:text-red-200">
          {error}
          <div className="text-xs mt-1">Your progress is saved locally</div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-yellow-500">
            <span className="animate-bounce inline-block">+{totalXP} XP</span>
          </div>
          {isPerfect && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="text-yellow-500">★</span> Perfect Bonus: +
              {PERFECT_SCORE_BONUS} XP
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Daily Total: {xpData.dailyXP} XP
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total XP: {xpData.totalXP} XP
          </div>
          {!isLoggedIn && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Sign up to save your progress permanently!
            </div>
          )}
        </>
      )}
    </div>
  );

  return <XPErrorBoundary>{content}</XPErrorBoundary>;
}
