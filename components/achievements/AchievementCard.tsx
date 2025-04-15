"use client";

import { Trophy, Heart } from "lucide-react";
import {
  Achievement,
  UserAchievement,
  AchievementProgress,
} from "@prisma/client";

interface AchievementCardProps {
  achievement: Achievement & {
    userAchievement?: UserAchievement;
    progress?: AchievementProgress;
  };
  onClaim?: (achievementId: number) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onClaim,
}) => {
  const {
    name,
    description,
    heartReward,
    requirement,
    type,
    userAchievement,
    progress,
  } = achievement;

  const progressValue = progress?.currentValue || 0;
  const progressPercentage = Math.min((progressValue / requirement) * 100, 100);

  return (
    <div className="card-container p-4 w-full max-w-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <Trophy
            className={`w-6 h-6 ${
              userAchievement?.completed ? "text-yellow-500" : "text-gray-400"
            } mr-2`}
          />
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Heart className="w-5 h-5 text-red-500 mr-1" />
          <span className="text-sm font-medium">{heartReward}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Progress
          </span>
          <span className="text-sm font-medium">
            {progressValue}/{requirement}
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {userAchievement?.completed && !userAchievement?.claimed && (
        <button
          onClick={() => onClaim?.(achievement.id)}
          className="btn-action mt-4 w-full"
        >
          Claim Reward
        </button>
      )}

      {userAchievement?.claimed && (
        <div className="mt-4 text-center text-sm text-green-500">
          Reward Claimed ✓
        </div>
      )}
    </div>
  );
};

export default AchievementCard;
