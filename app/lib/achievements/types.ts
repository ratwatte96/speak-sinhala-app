import {
  Achievement,
  UserAchievement,
  AchievementProgress,
} from "@prisma/client";

export type AchievementType = "daily" | "streak" | "xp" | "quiz";
export type ResetType = "daily" | "permanent";

export interface AchievementData {
  achievements: Achievement[];
  userAchievements: (UserAchievement & {
    achievement: Achievement;
  })[];
  progress: (AchievementProgress & {
    achievement: Achievement;
  })[];
}

export interface UseAchievementsReturn {
  achievementData: AchievementData;
  isLoading: boolean;
  error: string | null;
  updateProgress: (achievementId: number, progress: number) => Promise<void>;
  claimReward: (achievementId: number) => Promise<void>;
}

export interface AchievementCheckResult {
  completed: boolean;
  progress: number;
  achievementId: number;
}

export interface AchievementServiceResponse {
  achievements: AchievementCheckResult[];
  heartsAwarded: number;
}

export interface DailyResetResult {
  resetAchievements: number[];
  resetProgress: number[];
}

export interface AchievementProgressUpdate {
  userId: number;
  achievementId: number;
  currentValue: number;
  targetValue: number;
}

export interface AchievementRewardClaim {
  userId: number;
  achievementId: number;
  heartsAwarded: number;
}
