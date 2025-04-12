"use client";
//!Refactor

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
import { TutorialModal } from "./TutorialModal";
import { errorWithFile } from "@/utils/logger";
import CalculatingResultsScreen from "./CalculatingResultsScreen";
import { useQuizXPCalculator } from "../app/lib/experience-points/hooks";
import { updateLocalXP, getDailyLocalXP } from "@/utils/localStorageXP";
import { QuizType } from "@/app/lib/experience-points/types";

interface QuizProps {
  steps?: Step[];
  quiz_title?: string;
  quiz_id: number;
  loggedOut: boolean;
  isPremium?: boolean;
  nextQuizId?: any;
}

const Quiz: React.FC<QuizProps> = ({
  steps,
  quiz_title,
  quiz_id,
  loggedOut,
  isPremium,
  nextQuizId = "NoNextQuiz",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [currentStreak, setCurrentStreak] = useState<any>(undefined);
  const [showStreakUpdated, setShowStreakUpdated] = useState(false);
  const [showCalculatingResults, setShowCalculatingResults] =
    useState<boolean>(false);
  const [lives, setLives] = useState(1);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [useRefill, setUseRefill] = useState<boolean>(false);
  const [buyRefill, setBuyRefill] = useState<boolean>(false);
  const [refillMessage, setRefillMessage] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [xpEarned, setXpEarned] = useState<number>(0);
  const [dailyXpTotal, setDailyXpTotal] = useState<number>(0);
  const [xpUpdated, setXpUpdated] = useState<boolean>(false);

  const { setSharedState } = useSharedState();
  const pathname = usePathname();
  const calculateXP = useQuizXPCalculator();

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
          errorWithFile(error);
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
            errorWithFile(error);
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
    if (steps !== undefined) {
      const isFirstQuestionStep =
        startTime === null && steps[currentStep]?.type === "question";
      const isLastQuestionStep =
        steps[currentStep]?.type === "question" &&
        steps.slice(currentStep + 1).every((step) => step.type !== "question");

      if (isFirstQuestionStep) {
        setStartTime(Date.now());
      }

      if (isLastQuestionStep) {
        const endTime = Date.now();
        setElapsedTime(endTime - startTime!);
      }

      if (currentStep === steps.length - 1) {
        setShowCalculatingResults(true);
        setTimeout(async () => {
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
          setShowCalculatingResults(false);
        }, 2000);
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
        errorWithFile(error);
        return currentStreak;
      }
    }
  };

  const updateStatus = () => {
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

      // Calculate and store XP for non-logged-in users
      if (!xpUpdated) {
        try {
          const quizType: QuizType = pathname.includes("speak")
            ? "New Accents"
            : pathname.includes("read")
            ? "New Letters"
            : pathname.includes("custom-quiz")
            ? "Unit Test"
            : "New Rule";

          // Check if this is the first completion of the day
          const dailyXP = getDailyLocalXP();
          const isFirstCompletionOfDay = dailyXP === 0;

          const xpData = updateLocalXP(quizType, mistakeCount === 0);
          setXpEarned(xpData.awarded);
          setDailyXpTotal(xpData.dailyTotal);
          setXpUpdated(true);
        } catch (error: any) {
          errorWithFile(error);
        }
      }
    } else {
      if (!pathname.includes("custom-quiz") && !xpUpdated) {
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
            .then((statusData) => {
              if (statusData.xp) {
                setXpEarned(statusData.xp.awarded);
                setDailyXpTotal(statusData.xp.dailyTotal);
                setXpUpdated(true);
              }
            });
        } catch (error: any) {
          errorWithFile(error);
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
        errorWithFile(error);
      }
    }
  };

  const progress = steps !== undefined ? (currentStep / steps.length) * 100 : 0;

  const showCompletionScreen = quizCompleted && !showStreakUpdated;

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
  ) : showCalculatingResults ? (
    <CalculatingResultsScreen />
  ) : showCompletionScreen && xpUpdated ? (
    <QuizCompletionScreen
      isPerfect={mistakeCount === 0}
      nextQuizId={nextQuizId}
      elapsedTime={elapsedTime}
      mistakeCount={mistakeCount}
      xpEarned={xpEarned}
      dailyTotal={dailyXpTotal}
      isLoggedIn={!notSignedUp}
    />
  ) : showCompletionScreen && !xpUpdated ? (
    <CalculatingResultsScreen />
  ) : (
    <div className="flex-col-center mt-8">
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
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
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
      <TutorialModal
        localStorageName={"firstQuiz"}
        tutorialText={[
          "These quizzes are designed to help you learn Sinhala characters and accents. Before each quiz, you'll see the letters and accents you'll be learning. Take your time practicing before starting the quiz.",
          "The number next to the heart icon represents your lives. Each incorrect answer costs a life. If you run out of lives, you'll fail the quiz and need a refill to continue.",
          "The number next to the refresh icon shows your available refills. Before signing up, you'll have unlimited refills for Unit 1 (indicated by the infinity symbol). Using a refill restores your lives to 5, allowing you to keep going.",
          "The number next to the crown icon tracks your quiz streak. Your streak increases by 1 for each consecutive day you complete a quiz.",
          "Good luck, and enjoy learning Sinhala!",
        ]}
        title={"Learn Sinhala: Quiz"}
        display={() => (
          <div className="flex items-center space-x-4">
            <LivesCounter loggedOut={loggedOut} />
            <StreakCounter loggedOut={loggedOut} />
            <RefillCounter loggedOut={loggedOut} isPremium={isPremium} />
          </div>
        )}
      />
    </div>
  );
};

export default Quiz;
