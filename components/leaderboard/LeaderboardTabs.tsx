"use client";

import { useState } from "react";
import { Trophy, Clock } from "lucide-react";

interface LeaderboardTabsProps {
  onTabChange: (tab: "daily" | "allTime") => void;
}

export default function LeaderboardTabs({ onTabChange }: LeaderboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"daily" | "allTime">("daily");

  const handleTabChange = (tab: "daily" | "allTime") => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex border-b text-xl w-full">
      <button
        className={`px-4 py-2 flex items-center ${
          activeTab === "daily"
            ? "border-b-2 border-green-500 text-green-500 font-bold"
            : "text-gray-500 hover-transition"
        }`}
        onClick={() => handleTabChange("daily")}
      >
        <Clock className="w-5 h-5 mr-2" />
        <span>Daily</span>
      </button>
      <button
        className={`px-4 py-2 flex items-center ${
          activeTab === "allTime"
            ? "border-b-2 border-green-500 text-green-500 font-bold"
            : "text-gray-500 hover-transition"
        }`}
        onClick={() => handleTabChange("allTime")}
      >
        <Trophy className="w-5 h-5 mr-2" />
        <span>All Time</span>
      </button>
    </div>
  );
}
