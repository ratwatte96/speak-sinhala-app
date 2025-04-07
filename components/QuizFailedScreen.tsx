"use client";

import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { LivesCounter } from "./LivesCounter";
import { StreakCounter } from "./StreakCounter";
import { RefillCounter } from "./RefillCounter";

interface QuizFailedScreenProps {
  lives: number;
  setLives: (lives: number) => void;
  loggedOut: boolean;
  isPremium?: boolean;
  progress: number;
  setShowModal: any;
}

export default function QuizFailedScreen({
  lives,
  setLives,
  loggedOut,
  isPremium,
  progress,
  setShowModal,
}: QuizFailedScreenProps) {
  const router = useRouter();

  return (
    <div className="flex-col-center justify-center min-h-screen p-6 dark:bg-black">
      <div className="w-full px-4">
        <div className="flex justify-center">
          <div className="mr-2">
            <LivesCounter
              startingLives={lives}
              setMainLives={setLives}
              loggedOut={loggedOut}
            />
          </div>
          <div className="mr-2">
            <StreakCounter loggedOut={loggedOut} />
          </div>
          <RefillCounter loggedOut={loggedOut} isPremium={isPremium} />
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="flex-col-center bg-white p-8 rounded-2xl shadow-lg dark:bg-black dark:border dark:border-solid dark:border-gray-600">
        {/* Red Cross Icon for Failure */}
        <XCircle className="text-red-500 w-24 h-24 mb-6" />

        <h2 className="text-xl font-semibold text-gray-800 text-center dark:text-white">
          Quiz Failed! Don&apos;t give up!
        </h2>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          Keep practicing and try again to improve your score! 🔥
        </p>

        <div className="mt-6 w-full flex flex-col space-y-4">
          <button
            onClick={() => window.location.reload()} // FULL PAGE RELOAD
            className="bg-yellow-500 text-white w-full p-2 rounded-md"
          >
            Retry Quiz
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-green-500 text-white w-full p-2 rounded-md"
          >
            Go Home
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white w-full p-2 rounded-md"
          >
            Refill
          </button>
        </div>
      </div>
    </div>
  );
}
