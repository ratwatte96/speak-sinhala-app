"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Medal } from "lucide-react";
import { LeaderboardEntry } from "@/app/lib/leaderboard/types";

interface RankingListProps {
  entries: LeaderboardEntry[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function RankingList({
  entries,
  currentPage,
  totalPages,
  onPageChange,
}: RankingListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"; // Gold
      case 2:
        return "text-gray-400"; // Silver
      case 3:
        return "text-amber-700"; // Bronze
      default:
        return "text-gray-300";
    }
  };

  const filteredEntries = entries.filter((entry) =>
    entry.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-2">
        {filteredEntries.map((entry) => (
          <div
            key={entry.userId}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex items-center">
              <div className="w-8 text-center">
                {entry.rank <= 3 ? (
                  <Medal className={`w-5 h-5 ${getMedalColor(entry.rank)}`} />
                ) : (
                  <span className="text-gray-500">#{entry.rank}</span>
                )}
              </div>
              <span className="ml-4 font-medium">{entry.username}</span>
            </div>
            <span className="font-semibold text-yellow-500">
              {entry.score} XP
            </span>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
