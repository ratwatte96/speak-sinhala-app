"use client";

import { Crown } from "lucide-react";

interface StreakUpdateScreenProps {
  streak: any;
  onNext: () => void;
}

export default function StreakUpdateScreen({
  streak,
  onNext,
}: StreakUpdateScreenProps) {
  return (
    <div className="flex-col-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-black">
      <div className="flex-col-center bg-white p-8 rounded-2xl shadow-lg dark:bg-black dark:border dark:border-solid dark:border-gray-600">
        <Crown className="text-yellow-500 w-24 h-24 mb-6" />

        <h2 className="text-xl font-semibold text-gray-800 text-center dark:text-white">
          Streak Updated!
        </h2>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          You&apos;re on a <span className="font-bold">{streak}-day</span>{" "}
          streak! Keep it going! 🚀
        </p>

        <div className="mt-6 w-full">
          <button
            onClick={onNext} // Calls the provided onNext function
            className="bg-red-500 text-white w-full p-2 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
