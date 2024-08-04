"use client";

import React, { useState } from "react";
import { QuizData, QuizStep, QuizStepProps } from "./QuizStep";
import { Button } from "./Button";
import Link from "next/link";

interface QuizProps {
  steps: QuizData[];
}

const Quiz: React.FC<QuizProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const nextStep = () => {
    if (currentStep === steps.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  if (quizCompleted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Congratulations! You've completed the quiz.
        </h2>
        <Link href="/">
          <Button buttonLabel="Back to Home" callback={() => null} />
        </Link>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-skin-accent h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <QuizStep
        {...steps[currentStep]}
        nextStep={nextStep}
        answers={steps[currentStep].answers.sort(() => Math.random() - 0.5)}
      />
    </div>
  );
};

export default Quiz;
