"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface DailyProgressProps {
  achievements: {
    id: number;
    name: string;
    completed: boolean;
  }[];
}

const DailyProgress: React.FC<DailyProgressProps> = ({ achievements }) => {
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");

  useEffect(() => {
    const updateTimeUntilReset = () => {
      // Get current time in Sri Lanka timezone (UTC+5:30)
      const sriLankaTime = toZonedTime(new Date(), "Asia/Colombo");

      // Calculate next midnight in Sri Lanka time
      const tomorrow = new Date(sriLankaTime);
      tomorrow.setHours(24, 0, 0, 0);

      // Calculate time until reset
      const timeLeft = formatDistanceToNow(tomorrow, { addSuffix: true });
      setTimeUntilReset(timeLeft);
    };

    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const completedCount = achievements.filter((a) => a.completed).length;
  const totalCount = achievements.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="card-container p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Daily Achievements</h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>Resets {timeUntilReset}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>
            {completedCount}/{totalCount} Completed
          </span>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="space-y-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm">{achievement.name}</span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${
                  achievement.completed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {achievement.completed && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyProgress;
