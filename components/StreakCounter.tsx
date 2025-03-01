"use client";

import { fetchWithToken } from "@/utils/fetch";
import { errorWithFile } from "@/utils/logger";
import { checkPath } from "@/utils/random";
import { Crown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface StreakCounterProps {
  loggedOut?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ loggedOut }) => {
  const [streak, setStreak] = useState("loading");
  const pathname = usePathname();
  const notSignedUp = loggedOut && checkPath(pathname);

  useEffect(() => {
    if (notSignedUp) {
      let storedStreak: any = localStorage.getItem("streak");
      if (!storedStreak) {
        // First creation of local streak data
        storedStreak = "0";
        localStorage.setItem("streak", storedStreak);
      }

      let storedStreakDate: any = localStorage.getItem("streakDate");
      if (!storedStreakDate) {
        //First creation of streak date
        const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
        storedStreakDate = localStorage.setItem("streakDate", today);
      }

      const stored = new Date(storedStreakDate);
      const today = new Date();
      // Get difference in days
      const diffInTime = today.getTime() - stored.getTime();
      const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

      if (diffInDays >= 2) {
        //reset localStreak
        storedStreak = "0";
        localStorage.setItem("streak", storedStreak);
      }

      setStreak(storedStreak);
      return;
    } else {
      try {
        fetchWithToken(`/api/streak`)
          .then((res) => res.json())
          .then((streaksData) => {
            setStreak(streaksData.current_streak);
          });
      } catch (error: any) {
        errorWithFile(error);
      }
    }
  }, []);

  return (
    <p className="flex items-center">
      <Crown className="text-yellow-500" size={24} />
      <span className="ml-1 font-bold text-lg">
        {streak === "loading" ? (
          <span className="text-xs sm:text-lg">...</span>
        ) : (
          streak ?? 0
        )}
      </span>
    </p>
  );
};
