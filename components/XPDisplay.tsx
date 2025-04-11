"use client";

import { XP_VALUES } from "../app/lib/experience-points/hooks";

interface XPDisplayProps {
  xpEarned: number;
  dailyTotal: number;
  quizType: string;
  isPerfect?: boolean;
}

export default function XPDisplay({
  xpEarned,
  dailyTotal,
  quizType,
  isPerfect = false,
}: XPDisplayProps) {
  const baseXP =
    XP_VALUES[quizType as keyof typeof XP_VALUES] || XP_VALUES.quiz;
  const perfectBonus = isPerfect ? XP_VALUES.perfectScore : 0;
  const totalXP = xpEarned + perfectBonus;

  return (
    <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      <div className="text-2xl font-bold text-yellow-500">+{totalXP} XP</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Base: {baseXP} XP
        {isPerfect && (
          <span className="ml-2">
            Perfect Bonus: +{XP_VALUES.perfectScore} XP
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Daily Total: {dailyTotal} XP
      </div>
    </div>
  );
}
