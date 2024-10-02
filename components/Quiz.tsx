"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import Link from "next/link";
import { QuizData, QuizStep } from "./QuizStep";
import { LivesCounter } from "./LivesCounter";
import { StreakCounter } from "./StreakCounter";
import { Step } from "./Step";

interface QuizProps {
  steps?: Step[];
  startingLives: number;
  quiz_title?: string;
}

const Quiz: React.FC<QuizProps> = ({ steps, startingLives, quiz_title }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [lives, setLives] = useState(startingLives);

  useEffect(() => {
    if (lives === 0) {
      console.log("Quiz lives", lives);
      setQuizFailed(true);
    }
  }, [lives]);

  const nextStep = () => {
    if (lives === 0) {
      setQuizFailed(true);
    } else if (steps !== undefined && currentStep === steps.length - 1) {
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
        {/* <Link href="/">
          <Button buttonLabel="Back to Home" callback={() => null} />
        </Link> */}
      </div>
    );
  }

  const updateLives = () => {
    try {
      fetch(`/api/lives`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((livesData) => {
          setLives(livesData.total_lives);
        });
    } catch (error: any) {
      console.log(error);
    }
  };

  const progress = steps !== undefined ? (currentStep / steps.length) * 100 : 0;

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
    <div className="flex flex-col items-center">
      <div className="flex justify-start w-56 sm:w-40">
        <StreakCounter />
        <LivesCounter startingLives={lives} setMainLives={setLives} />
      </div>
      <div className="w-80 bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-skin-accent h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <h1 className="text-xl mb-2">{quiz_title}</h1>
      {steps !== undefined ? (
        <Step
          step={steps[currentStep]}
          nextStep={nextStep}
          updateLives={updateLives}
          lives={lives}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Quiz;
