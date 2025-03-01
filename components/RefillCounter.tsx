"use client";

import { useEffect, useState } from "react";
import { fetchWithToken } from "@/utils/fetch";
import { usePathname } from "next/navigation";
import { RefreshCcw, Infinity } from "lucide-react";
import { useSharedState } from "@/components/StateProvider";
import { errorWithFile } from "@/utils/logger";
import { checkPath } from "@/utils/random";

interface RefillCounterProps {
  loggedOut?: boolean;
  isPremium?: boolean;
}

export const RefillCounter: React.FC<RefillCounterProps> = ({
  loggedOut,
  isPremium,
}) => {
  const [loadingRefills, setLoadingRefills] = useState(true);
  const pathname = usePathname();
  const { sharedState, setSharedState } = useSharedState();

  const infinityRefills = isPremium || (loggedOut && checkPath(pathname));

  useEffect(() => {
    if (infinityRefills) {
      setLoadingRefills(false);
    } else {
      try {
        fetchWithToken(`/api/refill`, { method: "GET", credentials: "include" })
          .then((res) => res.json())
          .then((refillData) => {
            setSharedState("refills", refillData.total_refill);
            setLoadingRefills(false);
          });
      } catch (error: any) {
        errorWithFile(error);
      }
    }
  }, [sharedState.refills]);

  return (
    <p className="flex items-center">
      <RefreshCcw className="text-green-500" size={24} />
      <span className="ml-1 font-bold text-lg">
        {loadingRefills ? (
          <span className="text-xs sm:text-lg">...</span>
        ) : infinityRefills ? (
          <Infinity className="w-6 h-6 text-black-500 dark:text-white" />
        ) : (
          sharedState.refills ?? 0
        )}
      </span>
    </p>
  );
};
