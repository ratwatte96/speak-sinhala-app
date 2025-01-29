import { CheckCircle, XCircle, Lock } from "lucide-react";

export interface Lesson {
  number: number;
  type: string;
  content: string;
  description: string;
  status: "complete" | "incomplete" | "locked";
}

interface LessonCardProps {
  lesson: Lesson;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const statusIcons = {
    complete: <CheckCircle className="text-green-500" size={24} />, // Reduced size
    incomplete: <XCircle className="text-red-500" size={24} />, // Reduced size
    locked: <Lock className="text-black" size={24} />, // Reduced size
  };

  return (
    <div className="border rounded-lg p-3 shadow-md bg-white flex justify-between items-center text-xs sm:text-sm max-w-md mx-auto my-3">
      <div>
        <h2 className="text-sm sm:text-md font-bold">Lesson {lesson.number}</h2>
        <p className="text-gray-600 text-xs sm:text-sm">Type: {lesson.type}</p>
        <p className="text-gray-600 text-xs sm:text-sm">
          Content: {lesson.content}
        </p>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
          {lesson.description}
        </p>
      </div>
      <div className="flex flex-col items-center">
        {statusIcons[lesson.status]}
        <span className="text-gray-700 text-xs sm:text-sm capitalize">
          {lesson.status}
        </span>
      </div>
    </div>
  );
};

export default LessonCard;
