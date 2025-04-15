"use client";

import { CheckCircle2 } from "lucide-react";

interface AchievementProgressProps {
  currentValue: number;
  targetValue: number;
  milestones?: number[];
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({
  currentValue,
  targetValue,
  milestones = [],
}) => {
  const progressPercentage = Math.min((currentValue / targetValue) * 100, 100);

  return (
    <div className="w-full">
      <div className="relative pt-4 pb-8">
        {/* Progress bar */}
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Milestones */}
        {milestones.map((milestone, index) => {
          const milestonePosition = (milestone / targetValue) * 100;
          const isMilestoneReached = currentValue >= milestone;

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${milestonePosition}%`, bottom: "0" }}
            >
              <div className="flex flex-col items-center">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    isMilestoneReached
                      ? "text-green-500"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
                <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  {milestone}
                </span>
              </div>
            </div>
          );
        })}

        {/* Current value indicator */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{ left: `${progressPercentage}%`, top: "0" }}
        >
          <div className="bg-green-500 text-white text-xs rounded px-2 py-1">
            {currentValue}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementProgress;
