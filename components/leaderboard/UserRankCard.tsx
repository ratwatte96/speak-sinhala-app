"use client";

import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { useUserRank } from "@/app/lib/leaderboard/hooks";

interface UserRankCardProps {
  type: "daily" | "allTime";
  score: number;
  totalParticipants: number;
}

export default function UserRankCard({
  type,
  score,
  totalParticipants,
}: UserRankCardProps) {
  const { dailyRank, allTimeRank } = useUserRank();
  const currentRank = type === "daily" ? dailyRank : allTimeRank;

  const getPositionIndicator = () => {
    if (!currentRank) return null;
    const isTopHalf = currentRank <= totalParticipants / 2;

    return isTopHalf ? (
      <TrendingUp className="w-5 h-5 text-green-500" />
    ) : (
      <TrendingDown className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
          <div>
            <h3 className="text-lg font-semibold">Your Rank</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {type === "daily" ? "Today's Performance" : "All-Time Standing"}
            </p>
          </div>
        </div>
        {getPositionIndicator()}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">
            #{currentRank || "-"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Rank</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-500">{score}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">XP</p>
        </div>
      </div>

      <p className="text-xs text-center mt-4 text-gray-400">
        Out of {totalParticipants} participants
      </p>
    </div>
  );
}
