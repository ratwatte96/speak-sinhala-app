"use client";
import { CheckCircle, XCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

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
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const router = useRouter();
  const handleRouting = (value: string) => {
    router.push(`/quiz/${lesson.quizId}`);
  };

  const statusIcons = {
    complete: <CheckCircle className="text-green-500" size={24} />, // Reduced size
    incomplete: <XCircle className="text-red-500" size={24} />, // Reduced size
    locked: <Lock className="text-black" size={24} />, // Reduced size
  };

  return (
    <div className="border rounded-lg p-3 shadow-md bg-white flex justify-between items-center text-xs sm:text-sm mx-auto my-3">
      <div>
        <h2 className="text-sm sm:text-md font-bold">{lesson.quizName}</h2>
        <p className="text-gray-600 text-xs sm:text-sm">Type: {lesson.type}</p>
        <p className="text-gray-600 text-xs sm:text-sm">
          Content: {lesson.content}
        </p>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
          {lesson.description}
        </p>
      </div>
      <div className="flex flex-col items-center">
        {lesson.isPerfect ? "Perfect Score" : "No perfect score"}
        {statusIcons[lesson.status]}
        <span className="text-gray-700 text-xs sm:text-sm capitalize">
          {lesson.status}
        </span>
        {lesson.status !== "locked" && (
          <button
            onClick={() => handleRouting(lesson.quizId)}
            className="bg-green-500 text-black p-1 rounded-md w-28"
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonCard;
