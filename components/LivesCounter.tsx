"use client";

import { useEffect, useState } from "react";
import { fetchWithToken } from "@/utils/fetch";

interface LivesCounterProps {
  startingLives?: number;
  setMainLives?: (lives: number) => void;
}

export const LivesCounter: React.FC<LivesCounterProps> = ({
  startingLives,
  setMainLives,
}) => {
  const [lives, setLives] = useState(startingLives);
  const [loadingLives, setLoadingLives] = useState(true);

  useEffect(() => {
    try {
      fetchWithToken(`/api/lives`, { method: "GET", credentials: "include" })
        .then((res) => res.json())
        .then((livesData) => {
          setLives(livesData.total_lives);
          setLoadingLives(false);
          if (setMainLives) setMainLives(livesData.total_lives);
        });
    } catch (error: any) {
      console.log(error);
    }
  }, [startingLives]);

  return (
    <p className="flex items-center text-skin-base">
      {loadingLives ? "loading" : lives}
      <span className="text-xl ml-1 text-skin-accent">&#x2764;</span>
    </p>
  );
};
