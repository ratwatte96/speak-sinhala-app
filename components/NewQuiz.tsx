"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import Link from "next/link";
import { NewQuizData, NewQuizStep } from "./NewQuizStep";
import { LivesCounter } from "./LivesCounter";
import { StreakCounter } from "./StreakCounter";

interface QuizProps {
  steps?: NewQuizData[];
  startingLives: number;
  question?: string;
}

const NewQuiz: React.FC<QuizProps> = ({ steps, startingLives, question }) => {
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
        <Link href="/">
          <Button buttonLabel="Back to Home" callback={() => null} />
        </Link>
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
      {steps !== undefined ? (
        <NewQuizStep
          question={question}
          updateLives={updateLives}
          lives={lives}
          {...steps[currentStep]}
          nextStep={nextStep}
          answers={steps[currentStep].answers}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NewQuiz;
