"use client";

import { CheckCircle, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizCompletionScreenProps {
  isPerfect?: boolean;
  nextQuizId: any;
}

export default function QuizCompletionScreen({
  isPerfect = false,
  nextQuizId,
}: QuizCompletionScreenProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 dark:bg-black">
      <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg dark:bg-black dark:border dark:border-solid dark:border-gray-600">
        {isPerfect ? (
          <Star className="text-yellow-500 w-24 h-24 mb-6" />
        ) : (
          <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
        )}

        <h2 className="text-xl font-semibold text-gray-800 text-center dark:text-white">
          {isPerfect
            ? "Perfect Score! You got everything right!"
            : "Congratulations on completing the quiz!"}
        </h2>

        {!isPerfect && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
            Almost there! Try again and aim for a perfect score! 🎯
          </p>
        )}

        <div className="mt-6 w-full flex flex-col space-y-4">
          <button
            onClick={() => window.location.reload()} // Forces a re-render of the page
            className="bg-yellow-500 text-white w-full p-2 rounded-md"
          >
            Retry Quiz
          </button>
          <button
            onClick={() => setTimeout(() => router.push("/"), 2000)}
            className="bg-green-500 text-white w-full p-2 rounded-md"
          >
            Go Home
          </button>
          {nextQuizId !== "NoNextQuiz" && (
            <button
              onClick={() =>
                setTimeout(() => router.push(`/quiz/${nextQuizId}`), 2000)
              }
              className="bg-red-500 text-white w-full p-2 rounded-md"
            >
              Next Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
