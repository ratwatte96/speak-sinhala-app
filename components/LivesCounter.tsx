"use client";

import { useEffect, useState } from "react";
import { fetchWithToken } from "@/utils/fetch";
import { usePathname } from "next/navigation";

interface LivesCounterProps {
  startingLives?: number;
  setMainLives?: (lives: number) => void;
  loggedOut?: boolean;
}

export const LivesCounter: React.FC<LivesCounterProps> = ({
  startingLives,
  setMainLives,
  loggedOut,
}) => {
  const [lives, setLives] = useState(startingLives);
  const [loadingLives, setLoadingLives] = useState(true);
  const pathname = usePathname();

  // if this a quiz page and if this is a quiz number in unit 1 and if there is no token
  useEffect(() => {
    if (
      loggedOut &&
      pathname.includes("quiz") &&
      ["28", "29", "30", "31", "32", "33"].includes(
        pathname.split("/").pop() || "0"
      )
    ) {
      let storedLives: any = localStorage.getItem("lives");
      if (!storedLives) {
        storedLives = localStorage.setItem("lives", "5");
      }
      setLives(parseInt(storedLives));
      setLoadingLives(false);
      if (setMainLives) setMainLives(parseInt(storedLives));
      return;
    } else {
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
    }
  }, [startingLives]);

  return (
    <p className="flex items-center text-skin-base">
      {loadingLives ? "loading" : lives}
      <span className="text-xl ml-1 text-skin-accent">&#x2764;</span>
    </p>
  );
};
