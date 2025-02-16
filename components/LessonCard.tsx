"use client";
import { CheckCircle, XCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface Lesson {
  number: null | undefined;
  quizName: string;
  type: string;
  content: string;
  description: string;
  status: "complete" | "incomplete" | "locked";
  quizId: string;
  isPerfect: boolean;
}

interface LessonCardProps {
  lesson: Lesson;
  quizId: any;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, quizId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleRouting = (value: string) => {
    setIsLoading(true);
    router.push(`/quiz/${lesson.quizId}`);
  };

  const statusIcons = {
    complete: <CheckCircle className="text-green-500" size={24} />, // Reduced size
    incomplete: <XCircle className="text-red-500" size={24} />, // Reduced size
    locked: <Lock className="text-black dark:text-white" size={24} />, // Reduced size
  };

  return (
    <div className="border rounded-lg p-3 shadow-md bg-white flex justify-between items-center text-xs sm:text-sm mx-auto my-3 dark:bg-black dark:border dark:border-solid dark:border-gray-600">
      <div className="w-3/4">
        <h2 className="text-sm sm:text-md font-bold">{lesson.quizName}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          Type: {lesson.type}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          Content: {lesson.content}
        </p>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
          {lesson.description}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <p className="mb-1 w-[5rem] sm:w-32 text-center">
          {lesson.isPerfect ? "Perfect Score" : "No perfect score"}
        </p>
        {statusIcons[lesson.status]}
        <span
          className={`text-gray-700 text-xs sm:text-sm capitalize ${
            lesson.status === "complete"
              ? "dark:text-green-500"
              : "dark:text-white"
          }`}
        >
          {lesson.status}
        </span>
        {lesson.status === "locked" && quizId > 1 && (
          <p className="text-center">{`Complete Unit ${
            quizId - 1
          } to unlock`}</p>
        )}
        {lesson.status !== "locked" && (
          <button
            onClick={() => handleRouting(lesson.quizId)}
            className="bg-green-500 dark:bg-green-600 text-black p-1 rounded-md w-28 text-black hover:text-white dark:text-gray-200 dark:hover:border dark:hover:border-green-400 dark:hover:text-green-400 dark:hover:bg-black"
          >
            {isLoading ? "Loading..." : "Start"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonCard;
