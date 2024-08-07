"use client";

import { useEffect, useState } from "react";

interface LivesCounterProps {
  startingLives?: number;
  setMainLives?: (lives: number) => void;
}

export const LivesCounter: React.FC<LivesCounterProps> = ({
  startingLives = 100,
  setMainLives,
}) => {
  const [lives, setLives] = useState(startingLives);

  useEffect(() => {
    try {
      fetch(`/api/lives`)
        .then((res) => res.json())
        .then((livesData) => {
          setLives(livesData.total_lives);
          if (setMainLives) setMainLives(livesData.total_lives);
        });
    } catch (error: any) {
      console.log(error);
    }
  }, [startingLives]);

  return <p className="text-skin-base">{lives === 100 ? "loading" : lives}</p>;
};
