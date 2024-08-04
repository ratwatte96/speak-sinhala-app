"use client";

// import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/Button";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import Toast, { ToastType } from "./Toast";

type Answer = {
  buttonLabel: string;
  value: string;
};

export interface QuizData {
  question: string;
  answers: Answer[];
  correctAnswer: string;
  imagePath: string;
  // audioPath: string;
}

export interface QuizStepProps extends QuizData {
  nextStep: () => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({
  question,
  answers,
  correctAnswer,
  imagePath,
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
      <Image src={imagePath} alt="Example Image" width={160} height={250} />
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
