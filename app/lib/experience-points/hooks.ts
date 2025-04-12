import { useState, useEffect, useCallback } from "react";
import { fetchWithToken } from "@/utils/fetch";
import { errorWithFile } from "@/utils/logger";
import { XPData, UseXPReturn, QuizType, XPValues } from "./types";
import {
  XP_BY_TYPE,
  PERFECT_SCORE_BONUS,
  SUBSEQUENT_COMPLETION_MULTIPLIER,
} from "./index";
import { getTotalLocalXP, getDailyLocalXP } from "@/utils/localStorageXP";
import { useSharedState } from "@/components/StateProvider";

export const useXPState = () => {
  const { sharedState, setSharedState } = useSharedState();

  const updateXPState = useCallback(
    (dailyXP: number, totalXP: number) => {
      setSharedState("xp", { dailyXP, totalXP });
    },
    [setSharedState]
  );

  return {
    xpState: sharedState.xp,
    updateXPState,
  };
};

export const useXP = (): UseXPReturn => {
  const [xpData, setXPData] = useState<XPData>({
    dailyXP: 0,
    totalXP: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchXPData = async () => {
    try {
      const response = await fetchWithToken("/api/experience-points");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch XP data");
      }

      setXPData({
        dailyXP: data.dailyXP,
        totalXP: data.totalXP,
      });
      setError(null);
    } catch (err: any) {
      errorWithFile(err);
      setError(err.message || "Failed to fetch XP data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateXP = async (amount: number) => {
    try {
      const response = await fetchWithToken("/api/experience-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update XP");
      }

      setXPData({
        dailyXP: data.dailyXP,
        totalXP: data.totalXP,
      });
      setError(null);
    } catch (err: any) {
      errorWithFile(err);
      setError(err.message || "Failed to update XP");
      throw err; // Re-throw to let the caller handle the error
    }
  };

  useEffect(() => {
    fetchXPData();
  }, []);

  return {
    xpData,
    isLoading,
    error,
    updateXP,
  };
};

// Helper hook to calculate XP for a quiz completion
export const useQuizXPCalculator = () => {
  const calculateXP = (
    quizType: QuizType,
    isPerfectScore: boolean,
    isFirstCompletion: boolean
  ): number => {
    let baseXP = XP_BY_TYPE[quizType];

    if (!isFirstCompletion) {
      baseXP = Math.floor(baseXP * SUBSEQUENT_COMPLETION_MULTIPLIER);
    }

    if (isPerfectScore) {
      baseXP += PERFECT_SCORE_BONUS;
    }

    return baseXP;
  };

  return calculateXP;
};

export const useUnifiedXP = (isLoggedIn: boolean): UseXPReturn => {
  const { xpState, updateXPState } = useXPState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchXPData = useCallback(async () => {
    try {
      if (isLoggedIn) {
        const response = await fetchWithToken("/api/experience-points");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch XP data");
        }

        updateXPState(data.dailyXP, data.totalXP);
      } else {
        // Get XP from localStorage
        const totalXP = getTotalLocalXP();
        const dailyXP = getDailyLocalXP();

        updateXPState(dailyXP, totalXP);
      }
      setError(null);
    } catch (err: any) {
      errorWithFile(err);
      setError(err.message || "Failed to fetch XP data");
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, updateXPState]);

  const updateXP = useCallback(
    async (amount: number) => {
      try {
        if (isLoggedIn) {
          const response = await fetchWithToken("/api/experience-points", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to update XP");
          }

          updateXPState(data.dailyXP, data.totalXP);
        } else {
          // For non-logged-in users, XP updates are handled directly by Quiz component
          // This hook only needs to refresh the display
          const totalXP = getTotalLocalXP();
          const dailyXP = getDailyLocalXP();

          updateXPState(dailyXP, totalXP);
        }
        setError(null);
      } catch (err: any) {
        errorWithFile(err);
        setError(err.message || "Failed to update XP");
        throw err;
      }
    },
    [isLoggedIn, updateXPState]
  );

  useEffect(() => {
    fetchXPData();
  }, [fetchXPData]);

  return {
    xpData: xpState,
    isLoading,
    error,
    updateXP,
  };
};
