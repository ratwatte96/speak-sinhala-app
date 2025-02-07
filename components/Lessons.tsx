"use client";

import { useEffect, useState } from "react";
import LessonCard from "./LessonCard";

interface LessonsProps {
  unitData: any;
  readStatus: any;
}

const Lessons: React.FC<LessonsProps> = ({ unitData, readStatus }) => {
  let processedUnitData: any = [];
  const localStorageJson: any = localStorage.getItem("quizProgress");
  console.log(unitData[0].quizes);
  unitData.forEach((unit: any, unitIndex: number) => {
    processedUnitData[unitIndex] = { unitId: unitIndex + 1, quizes: [] };
    unit.quizes.forEach((quiz: any, quizIndex: number) => {
      processedUnitData[unitIndex].quizes.push({
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
      });
    });
  });

  return (
    <>
      {processedUnitData.map((unitData: any, unitIndex: number) => (
        <div key={unitIndex}>
          <div className="flex justify-center">
            <h2>{`Unit: ${unitData.unitId}`}</h2>
          </div>
          {unitData.quizes.map((quizData: any) => (
            <LessonCard key={quizData.quizName} lesson={quizData} />
          ))}
        </div>
      ))}
    </>
  );
};

export default Lessons;
