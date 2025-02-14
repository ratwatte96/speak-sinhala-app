"use client";

import { useState, useEffect } from "react";

interface CompletionBarProps {
  quizPercentage: number;
}

export const CompletionBar: React.FC<CompletionBarProps> = ({
  quizPercentage,
}) => {
  const [percentageComplete, setPercentageComplete] = useState(quizPercentage);

  useEffect(() => {
    if (quizPercentage === 0) {
      const storedQuizProgress = localStorage.getItem("quizProgress");
      if (storedQuizProgress) {
        const countComplete = (arr: any[]): number => {
          return arr.reduce(
            (count, item) => (item.status === "complete" ? count + 1 : count),
            0
          );
        };
        const { quizes } = JSON.parse(storedQuizProgress);
        const completeQuizes = countComplete(quizes);
        setPercentageComplete(Math.floor(completeQuizes / 74));
      }
    }
  }, []);

  return (
    <div className="relative w-full h-3 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
      <div
        className="h-full bg-gray-400 dark:bg-gray-500 transition-all duration-100"
        style={{ width: `${Math.floor(percentageComplete ?? 0)}%` }}
      ></div>

      <div className="absolute inset-0 flex items-center justify-center text-xs text-black dark:text-white font-semibold">
        {Math.floor(percentageComplete ?? 0)}%
      </div>
    </div>
  );
};
