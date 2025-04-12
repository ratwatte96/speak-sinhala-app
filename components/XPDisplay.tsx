"use client";

import { PERFECT_SCORE_BONUS } from "../app/lib/experience-points/index";

interface XPDisplayProps {
  xpEarned: number;
  dailyTotal: number;
  isPerfect?: boolean;
}

export default function XPDisplay({
  xpEarned,
  dailyTotal,
  isPerfect = false,
}: XPDisplayProps) {
  const perfectBonus = isPerfect ? PERFECT_SCORE_BONUS : 0;
  const totalXP = xpEarned + perfectBonus;

  return (
    <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      <div className="text-2xl font-bold text-yellow-500">+{totalXP} XP</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {isPerfect && (
          <span className="ml-2">Perfect Bonus: +{PERFECT_SCORE_BONUS} XP</span>
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Daily Total: {dailyTotal} XP
      </div>
    </div>
  );
}
