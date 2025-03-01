"use client";
//!Refactor

import { useEffect, useState } from "react";
import LessonCard from "./LessonCard";

interface LessonsProps {
  unitData: any;
  readStatus: any;
  loggedIn?: boolean;
}

const Lessons: React.FC<LessonsProps> = ({
  unitData,
  readStatus,
  loggedIn,
}) => {
  const [processedUnitData, setProcessedUnitData] = useState<any>([]);

  useEffect(() => {
    const localStorageJson: any = localStorage.getItem("quizProgress");
    let newProcessedUnitData: any = [];
    unitData.forEach((unit: any, unitIndex: number) => {
      newProcessedUnitData[unitIndex] = { unitId: unitIndex + 1, quizes: [] };
      unit.quizes.forEach((quiz: any, quizIndex: number) => {
        newProcessedUnitData[unitIndex].quizes.push({
          quizName: quiz.quiz.quiz_name,
          content: quiz.quiz.content,
          type: quiz.quiz.type,
          description: quiz.quiz.description,
          quizId: quiz.quizId,
          status:
            unitIndex + 1 <= readStatus
              ? quiz.userQuizRecord?.status ??
                (unitIndex + 1 === 1
                  ? JSON.parse(localStorageJson)?.quizes?.find(
                      (localStorageQuiz: any) =>
                        localStorageQuiz.quizId === quiz.quizId
                    )?.status
                  : "incomplete") ??
                "incomplete"
              : "locked",
          isPerfect:
            unitIndex + 1 <= readStatus
              ? quiz.userQuizRecord?.perfect_score ??
                (unitIndex + 1 === 1
                  ? JSON.parse(localStorageJson)?.quizes?.find(
                      (localStorageQuiz: any) =>
                        localStorageQuiz.quizId === quiz.quizId
                    )?.isPerfect
                  : false) ??
                false
              : false,
        });
      });
    });
    setProcessedUnitData(newProcessedUnitData);
  }, []); // Run only on mount

  return (
    <>
      {processedUnitData.map((unitData: any, unitIndex: number) => (
        <div key={unitIndex} className="w-full">
          <div className="flex items-center">
            <h2 className="text-xl font-bold ml-2">{`Unit: ${unitData.unitId}`}</h2>
            {!loggedIn && unitIndex !== 0 && (
              <span className="text-xs sm:text-sm ml-4">
                (
                <a
                  href="/login"
                  className="relative z-10 text-green-600 underline"
                >
                  Login
                </a>{" "}
                or{" "}
                <a
                  href="/signup"
                  className="relative z-10 text-yellow-500 underline"
                >
                  Signup
                </a>{" "}
                to access)
              </span>
            )}
          </div>
          {unitData.quizes.map((quizData: any) => (
            <LessonCard
              key={quizData.quizName}
              lesson={quizData}
              quizId={unitIndex + 1}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default Lessons;
