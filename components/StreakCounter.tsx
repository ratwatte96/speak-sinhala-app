"use client";

import { useEffect, useState } from "react";

export const StreakCounter: React.FC = () => {
  const [streak, setStreak] = useState("loading");

  useEffect(() => {
    try {
      fetch(`/api/streak`)
        .then((res) => res.json())
        .then((streaksData) => {
          setStreak(streaksData.current_streak);
        });
    } catch (error: any) {
      console.log(error);
    }
  }, []);
  return <p className="text-skin-base">{streak}</p>;
};
