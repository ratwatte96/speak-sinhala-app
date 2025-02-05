"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import Link from "next/link";
import { LivesCounter } from "./LivesCounter";
import { StreakCounter } from "./StreakCounter";
import { Step } from "./Step";
import { fetchWithToken } from "@/utils/fetch";
import { usePathname } from "next/navigation";
import RefillModal from "./RefillModal";
import { useSharedState } from "./StateProvider";

interface QuizProps {
  steps?: Step[];
  quiz_title?: string;
  quiz_id: number;
  loggedOut: boolean;
}

const Quiz: React.FC<QuizProps> = ({
  steps,
  quiz_title,
  quiz_id,
  loggedOut,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [lives, setLives] = useState(1);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [useRefill, setUseRefill] = useState<boolean>(false);
  const [buyRefill, setBuyRefill] = useState<boolean>(false);
  const [refillMessage, setRefillMessage] = useState<string>("");
  const { setSharedState } = useSharedState();
  const pathname = usePathname();

  useEffect(() => {
    if (lives === 0) {
      setShowModal(true);
    }

    if (useRefill) {
      const refill = async () => {
        try {
          const response: any = await fetchWithToken(`/api/refill?quizId=0`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const responseData = await response.json();
          if (response.ok) {
            setSharedState(responseData.total_lives);
            setRefillMessage("Refill Successful");
          } else {
            setRefillMessage(responseData.error);
          }
        } catch (error: any) {
          console.log(error);
        }
      };
      refill();
    }

    if (buyRefill) {
      const updateRefill = async (newTotal: number) => {
        const res = await fetchWithToken("/api/buy-refill", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newTotal }),
        });

        const data = await res.json();

        if (data.ok) {
          setSharedState(data.total_lives);
          setRefillMessage("Refill Purchased");
        } else {
          setRefillMessage(data.error);
        }
        return data;
      };
      updateRefill(1);
    }
  }, [lives, useRefill, buyRefill]);

  const nextStep = (isMistake: boolean) => {
    if (lives === 0) {
      setQuizFailed(true);
    } else if (steps !== undefined && currentStep === steps.length - 1) {
      setQuizCompleted(true);
    } else {
      if (isMistake) {
        setMistakeCount(mistakeCount + 1);
        if (mistakeCount !== 3) {
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
    if (
      loggedOut &&
      pathname.includes("quiz") &&
      ["28", "29", "30", "31", "32", "33"].includes(
        pathname.split("/").pop() || "0"
      )
    ) {
      let storedStreakDate: any = localStorage.getItem("streakDate");
      if (!storedStreakDate) {
        const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
        storedStreakDate = localStorage.setItem("streakDate", today);
      }

      const stored = new Date(storedStreakDate);
      const today = new Date();

      // Get difference in days
      const diffInTime = today.getTime() - stored.getTime();
      const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

      if (diffInDays === 1) {
        let storedStreak: any = localStorage.getItem("streak");
        let newStreak: any = parseInt(storedStreak) + 1;
        localStorage.setItem("streak", `${newStreak}`);
        localStorage.setItem("streakDate", today.toISOString().split("T")[0]);
        return;
      }
    } else {
      try {
        fetchWithToken("/api/streak", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((streakData) => {});
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  //! maybe combine updateStatus and updateStreak
  const updateStatus = () => {
    //! need to make sure nobody can just hit this endpoint
    try {
      fetchWithToken("/api/updateQuizStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz_id }),
      })
        .then((res) => res.json())
        .then((streakData) => {});
    } catch (error: any) {
      console.log(error);
    }
  };

  const refill = async () => {
    if (
      loggedOut &&
      pathname.includes("quiz") &&
      ["28", "29", "30", "31", "32", "33"].includes(
        pathname.split("/").pop() || "0"
      )
    ) {
      let storedLives: any = localStorage.getItem("lives");
      if (!storedLives) {
        storedLives = localStorage.setItem("lives", "5");
      }
      const newLives = parseInt(storedLives) + 5;
      storedLives = localStorage.setItem("lives", `${newLives}`);
      setLives(newLives);
      setShowModal(false);
    } else {
      try {
        const response: any = await fetchWithToken(
          `/api/refill?quizId=${pathname.split("/").pop()}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseData = await response.json();
        if (response.ok) {
          setLives(responseData.total_lives);
          setRefillMessage("Refill Successful");
          setShowModal(false);
        } else {
          setRefillMessage(responseData.error);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  if (quizFailed) {
    updateStreak();
  }

  if (quizCompleted) {
    updateStreak();
    updateStatus();

    if ([28, 29, 30, 31, 32, 33].includes(quiz_id)) {
      const storedData = localStorage.getItem("quizProgress");
      if (!storedData) {
        const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // Expiry in 1 week
        const dataToStore = {
          quizes: [{ quizId: quiz_id, status: "complete" }],
          expiry,
        };
        localStorage.setItem("quizProgress", JSON.stringify(dataToStore));
      } else {
        const { quizes, expiry } = JSON.parse(storedData);
        if (Date.now() > expiry) {
          localStorage.removeItem("quizProgress"); // Remove expired data
          return [];
        }

        // Prevent duplicate quizId entries
        const newQuiz = { quizId: quiz_id, status: "complete" };
        const existingIndex = quizes.findIndex(
          (q: any) => q.quizId === newQuiz.quizId
        );
        if (existingIndex !== -1) {
          quizes[existingIndex] = newQuiz; // Update existing entry
        } else {
          quizes.push(newQuiz); // Add new entry
        }

        // Store new data
        const dataToStore = {
          quizes: quizes,
          expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        localStorage.setItem("quizProgress", JSON.stringify(dataToStore));
      }
    }

    return (
      <div className="text-center">
        <LivesCounter startingLives={lives} loggedOut={loggedOut} />
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
    if (
      loggedOut &&
      pathname.includes("quiz") &&
      ["28", "29", "30", "31", "32", "33"].includes(
        pathname.split("/").pop() || "0"
      )
    ) {
      let storedLives: any = localStorage.getItem("lives");
      if (!storedLives) {
        storedLives = localStorage.setItem("lives", "5");
      }
      const newLives = parseInt(storedLives) - 1;
      storedLives = localStorage.setItem("lives", `${newLives}`);
      setLives(newLives);
    } else {
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
    }
  };

  const progress = steps !== undefined ? (currentStep / steps.length) * 100 : 0;

  return quizFailed ? (
    <div className="text-center">
      <LivesCounter
        startingLives={lives}
        setMainLives={setLives}
        loggedOut={loggedOut}
      />
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
        <StreakCounter loggedOut={loggedOut} />
        <LivesCounter
          startingLives={lives}
          setMainLives={setLives}
          loggedOut={loggedOut}
        />
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
      <RefillModal
        show={showModal}
        onClose={() => {
          setUseRefill(false);
          setBuyRefill(false);
          setRefillMessage("");
          setShowModal(false);
        }}
        onBuyRefill={() => setBuyRefill(true)}
        onUseRefill={() => setUseRefill(true)}
        refillMessage={refillMessage}
        disableBuy={buyRefill}
        disableUse={useRefill}
      />
    </div>
  );
};

export default Quiz;
