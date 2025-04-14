"use client";

import { useState } from "react";
import { useLeaderboard } from "@/app/lib/leaderboard/hooks";
import LeaderboardTabs from "./LeaderboardTabs";
import UserRankCard from "./UserRankCard";
import RankingList from "./RankingList";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function LeaderboardDisplay() {
  const [activeTab, setActiveTab] = useState<"daily" | "allTime">("daily");
  const [currentPage, setCurrentPage] = useState(1);
  const { leaderboardData, isLoading, error, refreshLeaderboard } =
    useLeaderboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Failed to load leaderboard data</p>
        <button
          onClick={refreshLeaderboard}
          className="mt-2 text-sm text-blue-500 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const currentData =
    activeTab === "daily" ? leaderboardData.daily : leaderboardData.allTime;
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const paginatedEntries = currentData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <LeaderboardTabs
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
      />

      <div className="mt-6">
        <UserRankCard
          type={activeTab}
          score={
            currentData.find(
              (entry) =>
                entry.rank ===
                (activeTab === "daily"
                  ? leaderboardData.userRank.daily
                  : leaderboardData.userRank.allTime)
            )?.score || 0
          }
          totalParticipants={currentData.length}
        />
      </div>

      <div className="mt-6">
        <RankingList
          entries={paginatedEntries}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
