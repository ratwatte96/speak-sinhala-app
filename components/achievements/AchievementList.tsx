"use client";

import { useState } from "react";
import {
  Achievement,
  UserAchievement,
  AchievementProgress,
} from "@prisma/client";
import AchievementCard from "./AchievementCard";

type AchievementWithProgress = Achievement & {
  userAchievement?: UserAchievement;
  progress?: AchievementProgress;
};

interface AchievementListProps {
  achievements: AchievementWithProgress[];
  onClaimReward: (achievementId: number) => void;
}

const ACHIEVEMENT_TYPES = ["all", "daily", "streak", "xp", "quiz"] as const;
type AchievementType = (typeof ACHIEVEMENT_TYPES)[number];

const AchievementList: React.FC<AchievementListProps> = ({
  achievements,
  onClaimReward,
}) => {
  const [selectedType, setSelectedType] = useState<AchievementType>("all");

  const filteredAchievements = achievements.filter((achievement) =>
    selectedType === "all" ? true : achievement.type === selectedType
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-wrap gap-2 mb-6">
        {ACHIEVEMENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors
              ${
                selectedType === type
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onClaim={onClaimReward}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No achievements found for this category.
        </div>
      )}
    </div>
  );
};

export default AchievementList;
