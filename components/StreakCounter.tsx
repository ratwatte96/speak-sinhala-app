"use client";

import { fetchWithToken } from "@/utils/fetch";
import { useEffect, useState } from "react";

export const StreakCounter: React.FC = () => {
  const [streak, setStreak] = useState("loading");

  useEffect(() => {
    try {
      fetchWithToken(`/api/streak`)
        .then((res) => res.json())
        .then((streaksData) => {
          setStreak(streaksData.current_streak);
        });
    } catch (error: any) {
      console.log(error);
    }
  }, []);
  return (
    <p className="flex items-center text-skin-base">
      {streak}
      <span className="text-xl">&#128293;</span>
    </p>
  );
};
