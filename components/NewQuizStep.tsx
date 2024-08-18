"use client";

// import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/Button";
import { useRef, useState, useCallback } from "react";
import Toast, { ToastType } from "./Toast";

type Answer = {
  sinhala?: string;
  buttonLabel: string;
  value: string;
};

export interface NewQuizData {
  question?: string;
  answers: Answer[];
  correctAnswer: string;
  phonetic: string;
  // audioPath: string;
}

export interface NewQuizStepProps extends NewQuizData {
  nextStep: () => void;
  updateLives: () => void;
  lives: number;
}

export const NewQuizStep: React.FC<NewQuizStepProps> = ({
  question,
  answers,
  correctAnswer,
  phonetic,
  updateLives,
  lives,
  // audioPath,
  nextStep,
}) => {
  const toastMessageRef = useRef<string | null>("");
  const toastTypeRef = useRef<ToastType>("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>("");

  const handleAnswer = useCallback(
    (answer: string) => {
      if (answer === correctAnswer) {
        toastMessageRef.current = "Correct";
        toastTypeRef.current = "Correct";
        nextStep();
      } else {
        updateLives();
        console.log("NewQuizStep", lives);
        if (lives - 1 === 0) nextStep();
        toastMessageRef.current = "Incorrect";
        toastTypeRef.current = "Incorrect";
      }
      setToastMessage(toastMessageRef.current);
      setToastType(toastTypeRef.current);
    },
    [correctAnswer, nextStep]
  );

  // const handleAudioEnd = useCallback(() => {
  //   console.log("Audio finished playing");
  // }, []);

  return (
    <div>
      <p>{question}</p>
      <div className="flex justify-center items-center my-4">
        <p className=" text-skin-base text-5xl sm:text-9xl">{phonetic}</p>
      </div>
      {/* {<AudioPlayer src={audioPath} onEnd={handleAudioEnd} />} */}
      <div className="w-80 flex flex-wrap justify-around items-center">
        {answers.map((answer) =>
          Object.hasOwn(answer, "sinhala") ? (
            <div
              key={answer.buttonLabel}
              onClick={() => handleAnswer(answer.value)}
              className="cursor-pointer hover:text-skin-accent flex flex-col items-center w-full my-1 rounded-lg border border-solid border-skin-base px-3 py-1 text-xs text-skin-muted  focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
            >
              <p>{answer.buttonLabel}</p>
              <p className="text-skin-base">{answer.sinhala}</p>
            </div>
          ) : (
            <Button
              key={answer.buttonLabel}
              callback={() => handleAnswer(answer.value)}
              buttonLabel={answer.buttonLabel}
              tailwindOverride="sm:w-full w-1/3 mx-2 mb-4"
            />
          )
        )}
      </div>
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          toastType={toastType}
        />
      )}
    </div>
  );
};
