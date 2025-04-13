"use client";

import { CheckCircle, Star, Home, ArrowRight, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import XPDisplay from "./XPDisplay";

interface QuizCompletionScreenProps {
  isPerfect?: boolean;
  nextQuizId: string | number;
  elapsedTime: number;
  mistakeCount: number;
  xpEarned?: number;
  dailyTotal?: number;
  isLoggedIn?: boolean;
}

export default function QuizCompletionScreen({
  isPerfect = false,
  nextQuizId,
  elapsedTime,
  mistakeCount,
  xpEarned = 0,
  isLoggedIn = false,
}: QuizCompletionScreenProps) {
  const router = useRouter();

  const totalSeconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  const handleNavigation = async (path: string) => {
    try {
      await router.push(path);
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  return (
    <div className="flex-col-center justify-center min-h-screen p-6 dark:bg-black">
      <div className="flex-col-center bg-white p-8 rounded-2xl shadow-lg dark:bg-black dark-base-border dark:border-gray-600 max-w-md w-full">
        <div className="mb-6 relative">
          {isPerfect ? (
            <div className="relative">
              <Star className="text-yellow-500 w-24 h-24" />
              <div className="absolute inset-0 animate-ping">
                <Star className="text-yellow-500 w-24 h-24 opacity-75" />
              </div>
            </div>
          ) : (
            <CheckCircle className="text-green-500 w-24 h-24" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center dark:text-white mb-2">
          {isPerfect ? "Perfect Score! 🎉" : "Quiz Completed! 🎯"}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          {isPerfect
            ? "Amazing work! You got everything right!"
            : "Great effort! Keep practicing to achieve a perfect score!"}
        </p>

        <div className="w-full space-y-6">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mistakes
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {mistakeCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {`${minutes}:${seconds}`}
              </p>
            </div>
          </div>

          <XPDisplay
            xpEarned={xpEarned}
            isPerfect={isPerfect}
            isLoggedIn={isLoggedIn}
          />

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg transition-colors"
            >
              <RotateCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </button>

            {nextQuizId !== "NoNextQuiz" && (
              <button
                onClick={() => handleNavigation(`/quiz/${nextQuizId}`)}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
              >
                <span>Next Quiz</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
