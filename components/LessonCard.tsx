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
    complete: <CheckCircle className="text-green-500" size={24} />,
    incomplete: <XCircle className="text-red-500" size={24} />,
    locked: <Lock className="text-black dark:text-white" size={24} />,
  };

  return (
    <div className="card-container flex justify-between mx-auto mb-3">
      <div className="w-3/4">
        <h2 className="text-base">{lesson.quizName}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Type: {lesson.type}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm w-5/6">
          Content: {lesson.content}
        </p>
        <p className="text-gray-500 mt-1 text-xs w-5/6">{lesson.description}</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="mb-1 sm:w-32 text-center text-sm">
          {lesson.isPerfect ? "Perfect 🏆" : "Not Perfect 🤏"}
        </p>

        {statusIcons[lesson.status]}
        <span
          className={`text-gray-700 capitalize text-sm ${
            lesson.status === "complete"
              ? "dark:text-green-500"
              : "dark:text-white"
          }`}
        >
          {lesson.status}
        </span>
        {lesson.status === "locked" && quizId > 1 && (
          <p className="text-center text-xs">{`Complete Unit ${
            quizId - 1
          } to unlock`}</p>
        )}
        {lesson.status !== "locked" && (
          <button
            onClick={() => handleRouting(lesson.quizId)}
            className="btn-primary text-sm mt-1 w-28"
          >
            {isLoading ? "Loading..." : "Start"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonCard;
