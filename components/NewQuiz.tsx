"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import Link from "next/link";
import { NewQuizData, NewQuizStep } from "./NewQuizStep";
import { LivesCounter } from "./LivesCounter";
import { StreakCounter } from "./StreakCounter";

interface QuizProps {
  steps: NewQuizData[];
  startingLives: number;
}

const NewQuiz: React.FC<QuizProps> = ({ steps, startingLives }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [lives, setLives] = useState(startingLives);

  useEffect(() => {
    if (lives === 0) {
      console.log("NewQuiz lives", lives);
      setQuizFailed(true);
    }
  }, [lives]);

  const nextStep = () => {
    if (lives === 0) {
      setQuizFailed(true);
    } else if (currentStep === steps.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const updateStreak = () => {
    try {
      fetch("/api/streak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((streakData) => {
          console.log(streakData);
        });
    } catch (error: any) {
      console.log(error);
    }
  };

  if (quizFailed) {
    updateStreak();
  }

  if (quizCompleted) {
    updateStreak();
    return (
      <div className="text-center">
        <LivesCounter startingLives={lives} />
        <h2 className="text-2xl font-bold mb-4">
          Congratulations! You&apos;ve completed the quiz.
        </h2>
        <Link href="/">
          <Button buttonLabel="Back to Home" callback={() => null} />
        </Link>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return quizFailed ? (
    <div className="text-center">
      <LivesCounter startingLives={lives} setMainLives={setLives} />
      <h2 className="text-2xl font-bold mb-4">
        Sorry! You&apos;ve run out of lives.
      </h2>
      <Link href="/">
        <Button buttonLabel="Back to Home" callback={() => null} />
      </Link>
    </div>
  ) : (
    <div>
      <div className="flex justify-start w-56 sm:w-40">
        <StreakCounter />
        <LivesCounter startingLives={lives} setMainLives={setLives} />
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-skin-accent h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <NewQuizStep
        setLives={setLives}
        lives={lives}
        {...steps[currentStep]}
        nextStep={nextStep}
        answers={steps[currentStep].answers.sort(() => Math.random() - 0.5)}
      />
    </div>
  );
};

export default NewQuiz;
