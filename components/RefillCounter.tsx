"use client";

import { useEffect, useState } from "react";
import { fetchWithToken } from "@/utils/fetch";
// import { usePathname } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { useSharedState } from "@/components/StateProvider";

interface RefillCounterProps {
  startingLives?: number;
  setMainLives?: (lives: number) => void;
  loggedOut?: boolean;
}

export const RefillCounter: React.FC<RefillCounterProps> = ({ loggedOut }) => {
  const [loadingRefills, setLoadingRefills] = useState(true);
  // const pathname = usePathname();
  const { sharedState, setSharedState } = useSharedState();

  // if this a quiz page and if this is a quiz number in unit 1 and if there is no token
  useEffect(() => {
    // if (
    //   loggedOut &&
    //   pathname.includes("quiz") &&
    //   ["28", "29", "30", "31", "32", "33"].includes(
    //     pathname.split("/").pop() || "0"
    //   )
    // ) {
    //   let storedLives: any = localStorage.getItem("lives");
    //   if (!storedLives) {
    //     storedLives = localStorage.setItem("lives", "5");
    //   }
    //   setSharedState("refills", parseInt(storedLives));
    //   return;
    // } else {
    try {
      fetchWithToken(`/api/refill`, { method: "GET", credentials: "include" })
        .then((res) => res.json())
        .then((refillData) => {
          setSharedState("refills", refillData.total_refill);
          setLoadingRefills(false);
        });
    } catch (error: any) {
      console.log(error);
    }
    // }
  }, [sharedState.refills]);

  return (
    <p className="flex items-center">
      <RefreshCcw className="text-blue-500" size={24} />
      <span className="ml-1 font-bold text-lg">
        {loadingRefills ? "loading" : sharedState.refills}
      </span>
    </p>
  );
};
