"use client";

import { useEffect, useState } from "react";
import { fetchWithToken } from "@/utils/fetch";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { useSharedState } from "@/components/StateProvider";

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
  const [loadingLives, setLoadingLives] = useState(true);
  const pathname = usePathname();
  const { sharedState, setSharedState } = useSharedState();

  const notSignedUp =
    loggedOut &&
    ((pathname.includes("quiz") &&
      ["28", "29", "30", "31", "32", "33"].includes(
        pathname.split("/").pop() || "0"
      )) ||
      pathname.includes("read") ||
      pathname.includes("speak") ||
      pathname.includes("home"));
  // if this a quiz page and if this is a quiz number in unit 1 and if there is no token
  useEffect(() => {
    if (notSignedUp) {
      let storedLives: any = localStorage.getItem("lives");
      if (!storedLives) {
        storedLives = localStorage.setItem("lives", "5");
      }
      setSharedState("lives", parseInt(storedLives));
      setLoadingLives(false);
      if (setMainLives) setMainLives(parseInt(storedLives));
      return;
    } else {
      try {
        fetchWithToken(`/api/lives`, { method: "GET", credentials: "include" })
          .then((res) => res.json())
          .then((livesData) => {
            setSharedState("lives", livesData.total_lives);
            setLoadingLives(false);
            if (setMainLives) setMainLives(livesData.total_lives);
          });
      } catch (error: any) {
        console.log(error);
      }
    }
  }, [startingLives, sharedState.lives]);

  return (
    <p className="flex items-center">
      <Heart className="text-red-500" size={24} />
      <span className="ml-1 font-bold text-lg">
        {loadingLives ? (
          <span className="text-xs sm:text-lg">loading</span>
        ) : (
          sharedState.lives ?? 0
        )}
      </span>
    </p>
  );
};
