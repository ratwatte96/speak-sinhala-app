import { useState, useEffect, useCallback } from "react";
import { fetchWithToken } from "@/utils/fetch";
import { errorWithFile } from "@/utils/logger";
import { useSharedState } from "@/components/StateProvider";
import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import {
  Achievement,
  UserAchievement,
  AchievementProgress,
} from "@prisma/client";

// Types
interface AchievementData {
  available: Achievement[];
  completed: UserAchievement[];
  inProgress: AchievementProgress[];
}

interface UseAchievementsReturn {
  achievementData: AchievementData;
  isLoading: boolean;
  error: string | null;
  refreshAchievements: () => Promise<void>;
}

interface UseAchievementProgressReturn {
  progress: AchievementProgress | null;
  isLoading: boolean;
  error: string | null;
  updateProgress: (newValue: number) => Promise<void>;
}

// Helper to get Sri Lanka day anchor - matching the server implementation
const getSriLankaDayAnchor = (): Date => {
  const tz = "Asia/Colombo";
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  const start = startOfDay(zoned);
  return new Date(start.toISOString());
};

export const useAchievements = (): UseAchievementsReturn => {
  const [achievementData, setAchievementData] = useState<AchievementData>({
    available: [],
    completed: [],
    inProgress: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sharedState, setSharedState } = useSharedState();

  const fetchAchievementData = async () => {
    try {
      const response = await fetchWithToken("/api/achievements");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch achievement data");
      }

      const newData = {
        available: data.available,
        completed: data.completed,
        inProgress: data.inProgress,
      };

      setAchievementData(newData);

      // Update shared state with achievement data
      setSharedState("achievements", newData);

      setError(null);
    } catch (err: any) {
      errorWithFile(err);
      setError(err.message || "Failed to fetch achievement data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievementData();
  }, []);

  return {
    achievementData: sharedState.achievements,
    isLoading,
    error,
    refreshAchievements: fetchAchievementData,
  };
};

export const useAchievementProgress = (
  achievementId: number
): UseAchievementProgressReturn => {
  const [progress, setProgress] = useState<AchievementProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetchWithToken(
        `/api/achievements/progress?achievementId=${achievementId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch achievement progress");
      }

      setProgress(data.progress);
      setError(null);
    } catch (err: any) {
      errorWithFile(err);
      setError(err.message || "Failed to fetch achievement progress");
    } finally {
      setIsLoading(false);
    }
  }, [achievementId]);

  const updateProgress = useCallback(
    async (newValue: number) => {
      try {
        const response = await fetchWithToken("/api/achievements/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            achievementId,
            currentValue: newValue,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to update achievement progress"
          );
        }

        setProgress(data.progress);
        setError(null);
      } catch (err: any) {
        errorWithFile(err);
        setError(err.message || "Failed to update achievement progress");
        throw err;
      }
    },
    [achievementId]
  );

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    isLoading,
    error,
    updateProgress,
  };
};
