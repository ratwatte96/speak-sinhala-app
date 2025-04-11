"use client";

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
    {
      read: 8,
      speak: 12,
      quiz: 10,
      "custom-quiz": 15,
    }[quizType] || 10;

  const perfectBonus = isPerfect ? 5 : 0;
  const totalXP = xpEarned + perfectBonus;

  return (
    <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      <div className="text-2xl font-bold text-yellow-500">+{totalXP} XP</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Base: {baseXP} XP
        {isPerfect && <span className="ml-2">Perfect Bonus: +5 XP</span>}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Daily Total: {dailyTotal} XP
      </div>
    </div>
  );
}
