"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import Link from "next/link";
import { LivesCounter } from "./LivesCounter";
import { StreakCounter } from "./StreakCounter";
import { Step } from "./Step";
import Modal from "./Modal";
import { fetchWithToken } from "@/utils/fetch";

interface QuizProps {
  steps?: Step[];
  quiz_title?: string;
}

const Quiz: React.FC<QuizProps> = ({ steps, quiz_title }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [lives, setLives] = useState(1);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refillMessage, setRefillMessage] = useState<string>("");

  useEffect(() => {
    if (lives === 0) {
      setShowModal(true);
    }
  }, [lives]);

  const nextStep = (isMistake: boolean) => {
    if (lives === 0) {
      setQuizFailed(true);
    } else if (steps !== undefined && currentStep === steps.length - 1) {
      setQuizCompleted(true);
    } else {
      if (isMistake) {
        setMistakeCount(mistakeCount + 1);
        if (mistakeCount !== 3) {
          console.log("mistakeCount", mistakeCount);
          const mistakeStep =
            steps !== undefined ? steps[currentStep] : ({} as Step);
          let clone: Step = structuredClone(mistakeStep);
          if (clone.type === "question" && "isMistake" in clone.content)
            clone.content.isMistake = true;
          steps?.push(clone);
        }
      }
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const updateStreak = () => {
    try {
      fetchWithToken("/api/streak", {
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

  const refill = async () => {
    try {
      const response: any = await fetchWithToken("/api/refill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (response.ok) {
        setLives(responseData.total_lives);
        setRefillMessage("Refill Successful");
      } else {
        console.log(responseData);
        setRefillMessage(responseData.error);
      }
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
      fetchWithToken(`/api/lives`, {
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
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            nextStep(false);
          }}
          heading={"Note"}
        >
          <div>
            <p>You ran out of lives</p>
            <button
              onClick={refill}
              className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
            >
              Refill
            </button>
            {refillMessage !== "" ? <p>{refillMessage}</p> : null}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Quiz;
