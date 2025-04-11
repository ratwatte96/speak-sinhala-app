import { useEffect, useState } from "react";
import { fetchWithToken } from "@/utils/fetch";

interface XPStatsProps {
  totalXP: number;
}

export default function XPStats({ totalXP }: XPStatsProps) {
  const [dailyXP, setDailyXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXPData = async () => {
      try {
        const response = await fetchWithToken("/api/experience-points");
        const data = await response.json();
        if (response.ok) {
          setDailyXP(data.dailyXP);
        }
      } catch (error) {
        console.error("Failed to fetch XP data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchXPData();
  }, []);

  return (
    <div className="flex justify-between mt-4 bg-gray-300 dark:bg-black dark-base-border dark:border-gray-600 p-4 rounded-md">
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">Experience Points</span>
        <span className="text-xs text-gray-500">
          Track your learning progress
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-lg font-bold text-yellow-500">{totalXP} XP</span>
        <span className="text-xs text-gray-500">
          Today: {loading ? "..." : `${dailyXP} XP`}
        </span>
      </div>
    </div>
  );
}
