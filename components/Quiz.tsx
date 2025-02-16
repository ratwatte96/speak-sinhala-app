"use client";

import React, { useEffect, useState } from "react";
import { LivesCounter } from "./LivesCounter";
import { StreakCounter } from "./StreakCounter";
import { Step } from "./Step";
import { fetchWithToken } from "@/utils/fetch";
import { usePathname } from "next/navigation";
import RefillModal from "./RefillModal";
import { useSharedState } from "./StateProvider";
import { RefillCounter } from "./RefillCounter";
import QuizCompletionScreen from "./QuizCompletionScreen";
import QuizFailedScreen from "./QuizFailedScreen";
import StreakUpdateScreen from "./StreakUpdatedScreen";

interface QuizProps {
  steps?: Step[];
  quiz_title?: string;
  quiz_id: number;
  loggedOut: boolean;
  isPremium?: boolean;
}

const Quiz: React.FC<QuizProps> = ({
  steps,
  quiz_title,
  quiz_id,
  loggedOut,
  isPremium,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [currentStreak, setCurrentStreak] = useState<any>(undefined);
  const [showStreakUpdated, setShowStreakUpdated] = useState(false);
  const [lives, setLives] = useState(1);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [useRefill, setUseRefill] = useState<boolean>(false);
  const [buyRefill, setBuyRefill] = useState<boolean>(false);
  const [refillMessage, setRefillMessage] = useState<string>("");
  const { setSharedState } = useSharedState();
  const pathname = usePathname();
  const notSignedUp =
    loggedOut &&
    pathname.includes("quiz") &&
    ["28", "29", "30", "31", "32", "33"].includes(
      pathname.split("/").pop() || "0"
    );

  useEffect(() => {
    if (!currentStreak) {
      if (notSignedUp) {
        let storedStreak: any = localStorage.getItem("streak");
        if (!storedStreak) {
          storedStreak = "0";
          localStorage.setItem("streak", storedStreak);
        }
        setCurrentStreak(parseInt(storedStreak));
        return;
      } else {
        try {
          fetchWithToken(`/api/streak`)
            .then((res) => res.json())
            .then((streaksData: any) => {
              setCurrentStreak(parseInt(streaksData.current_streak));
            });
        } catch (error: any) {
          console.log(error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (quizFailed && lives === 5) {
      setQuizFailed(false);
    }
    if (!quizFailed && lives <= 0) {
      setQuizFailed(true);
    }

    if (useRefill) {
      const refill = async () => {
        if (notSignedUp) {
          //lives
          let storedLives: any = localStorage.getItem("lives");
          if (storedLives === "5") {
            setUseRefill(false);
            setRefillMessage("Lives are already full");
            return;
          }
          const newLives = 5;
          storedLives = localStorage.setItem("lives", `${newLives}`);
          setSharedState("lives", parseInt(storedLives));
          setUseRefill(false);
          setRefillMessage("Refill Successful");
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
              setSharedState("refills", responseData.total_refill);
              setSharedState("lives", responseData.total_lives);

              setRefillMessage("Refill Successful");
            } else {
              setRefillMessage(responseData.error);
            }
          } catch (error: any) {
            console.log(error);
          }
          setUseRefill(false);
        }
      };
      refill();
      setShowModal(false);
    }

    if (buyRefill) {
      const updateRefill = async (newTotal: number) => {
        if (notSignedUp) {
          setRefillMessage("You have unlimited refills while in free mode");
          setBuyRefill(false);
        } else {
          const res = await fetchWithToken(
            `/api/buy-refill?quizId=${pathname.split("/").pop()}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ newTotal }),
            }
          );

          const data = await res.json();

          if (res.ok) {
            setSharedState("refills", data.total_refill);
            setRefillMessage("Refill Purchased");
          } else {
            setRefillMessage(data.error);
          }
          setBuyRefill(false);
          return data;
        }
      };
      updateRefill(1);
    }
  }, [lives, useRefill, buyRefill]);

  const nextStep = async (isMistake: boolean) => {
    if (steps !== undefined && currentStep === steps.length - 1) {
      const updatedStreak = await updateStreak();
      if (
        typeof currentStreak === "number" &&
        parseInt(updatedStreak) > currentStreak
      ) {
        setCurrentStreak(updatedStreak);
        setShowStreakUpdated(true);
      } else {
        setQuizCompleted(true);
      }
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

  const updateStreak = async () => {
    if (notSignedUp) {
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
      let storedStreak: any = localStorage.getItem("streak");
      if (diffInDays >= 1) {
        let newStreak: any = parseInt(storedStreak) + 1;
        localStorage.setItem("streak", `${newStreak}`);
        localStorage.setItem("streakDate", today.toISOString().split("T")[0]);
        return newStreak;
      }
      return storedStreak;
    } else {
      try {
        const response = await fetchWithToken("/api/streak", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseData = await response.json();
        if (response.ok) {
          return responseData.current_streak;
        } else {
          return currentStreak;
        }
      } catch (error: any) {
        console.log(error);
        return currentStreak;
      }
    }
  };

  //! maybe combine updateStatus and updateStreak
  const updateStatus = () => {
    //! need to make sure nobody can just hit this endpoint
    if (notSignedUp) {
      const storedData = localStorage.getItem("quizProgress");
      if (!storedData) {
        const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // Expiry in 1 week
        const dataToStore = {
          quizes: [
            {
              quizId: quiz_id,
              status: "complete",
              isPerfect: mistakeCount === 0,
            },
          ],
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
        const newQuiz = {
          quizId: quiz_id,
          status: "complete",
          isPerfect: mistakeCount === 0,
        };
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
    } else {
      if (!pathname.includes("custom-quiz")) {
        try {
          fetchWithToken("/api/updateQuizStatus", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quiz_id,
              perfect_score: mistakeCount === 0,
            }),
          })
            .then((res) => res.json())
            .then((statusData) => {});
        } catch (error: any) {
          console.log(error);
        }
      }
    }
  };

  if (quizCompleted) {
    updateStatus();
  }

  const updateLives = () => {
    if (notSignedUp) {
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
    <>
      <QuizFailedScreen
        lives={lives}
        setLives={setLives}
        loggedOut={loggedOut}
        isPremium={isPremium}
        progress={progress}
        setShowModal={setShowModal}
      />
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
    </>
  ) : showStreakUpdated ? (
    <StreakUpdateScreen
      streak={currentStreak}
      onNext={() => {
        setShowStreakUpdated(false);
        setQuizCompleted(true);
      }}
    />
  ) : quizCompleted && !showStreakUpdated ? (
    <QuizCompletionScreen isPerfect={mistakeCount === 0} />
  ) : (
    <div className="flex flex-col items-center mt-8">
      {steps && steps[currentStep].type === "question" && (
        <>
          <div className="flex justify-around w-40">
            <LivesCounter
              startingLives={lives}
              setMainLives={setLives}
              loggedOut={loggedOut}
            />
            <StreakCounter loggedOut={loggedOut} />
            <RefillCounter loggedOut={loggedOut} isPremium={isPremium} />
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-skin-accent h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </>
      )}
      <h1 className="text-2xl">{quiz_title}</h1>
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
