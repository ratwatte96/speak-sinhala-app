"use client";

// import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/Button";
import { useRef, useState, useCallback } from "react";
import Toast, { ToastType } from "./Toast";
import { SinhalaDisplay } from "./SinhalaDisplay";

type Answer = {
  buttonLabel: string;
  value: string;
};

export interface NewQuizData {
  question: string;
  answers: Answer[];
  correctAnswer: string;
  phonetic: string;
  // audioPath: string;
}

export interface NewQuizStepProps extends NewQuizData {
  nextStep: () => void;
}

export const NewQuizStep: React.FC<NewQuizStepProps> = ({
  question,
  answers,
  correctAnswer,
  phonetic,
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
      <div className="flex justify-center">
        <p className="my-2 text-skin-base text-5xl sm:text-9xl">{phonetic}</p>
      </div>
      {/* {<AudioPlayer src={audioPath} onEnd={handleAudioEnd} />} */}
      <div className="w-40 flex flex-wrap justify-around items-center mt-4">
        {answers.map((answer) => (
          <Button
            key={answer.buttonLabel}
            callback={() => handleAnswer(answer.value)}
            buttonLabel={answer.buttonLabel}
            tailwindOverride="w-full my-1"
          />
        ))}
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
