"use client";

// import { AudioPlayer } from "@/components/AudioPlayer";
import { useCallback, useRef, useState } from "react";
import Toast, { ToastType } from "./Toast";
import { AudioPlayer } from "./AudioPlayer";
import { QuizData, QuizStep } from "./QuizStep";
import { LessonStep } from "./LessonStep";

export interface Step {
  type: "question" | "lesson" | "additional";
  content: QuizData | LessonStep;
}

interface LessonStep {
  stepType: string;
}

export interface StepProps {
  step: Step;
  nextStep: () => void;
  updateLives: () => void;
  lives: number;
}

export const Step: React.FC<StepProps> = ({
  step,
  nextStep,
  updateLives,
  lives,
}) => {
  return (
    <>
      {step.type === "question" && "answers" in step.content ? (
        <QuizStep
          correctAnswer={step.content.correctAnswer}
          question_word={step.content.question_word}
          updateLives={updateLives}
          lives={lives}
          nextStep={nextStep}
          answers={step.content.answers}
          questionType={step.content.questionType}
          specific_note={step.content.specific_note}
        />
      ) : (
        <LessonStep nextStep={nextStep} />
      )}
    </>
  );
};
