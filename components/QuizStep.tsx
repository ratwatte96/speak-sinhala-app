"use client";

// import { AudioPlayer } from "@/components/AudioPlayer";
import { useCallback, useRef, useState } from "react";
import Toast, { ToastType } from "./Toast";
import { AudioPlayer } from "./AudioPlayer";

type Answer = {
  sinhala?: string;
  buttonLabel: string;
  value: string;
  audio?: string;
};

export interface QuizData {
  question?: string;
  answers: Answer[];
  correctAnswer: string;
  question_word: string;
  additional_infomation?: string;
  questionType?: number;
  audio?: string;
}

export interface QuizStepProps extends QuizData {
  nextStep: () => void;
  updateLives: () => void;
  lives: number;
}

export const QuizStep: React.FC<QuizStepProps> = ({
  question,
  answers,
  correctAnswer,
  question_word,
  additional_infomation,
  updateLives,
  lives,
  audio,
  nextStep,
  questionType = 1,
}) => {
  const toastMessageRef = useRef<string | null>("");
  const toastTypeRef = useRef<ToastType>("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const handleAnswer = () => {
    if (selectedAnswer === correctAnswer) {
      toastMessageRef.current = "Correct";
      toastTypeRef.current = "Correct";
      nextStep();
    } else {
      updateLives();
      console.log("QuizStep", lives);
      if (lives - 1 === 0) nextStep();
      toastMessageRef.current = "Incorrect";
      toastTypeRef.current = "Incorrect";
    }
    setToastMessage(toastMessageRef.current);
    setToastType(toastTypeRef.current);
  };

  const handleAudioEnd = useCallback(() => {
    console.log("Audio finished playing");
  }, []);

  return (
    <div className="flex flex-col items-center">
      <p>{question}</p>
      <div className="flex flex-col justify-center items-center my-4">
        <p className=" text-skin-base text-5xl sm:text-9xl">{question_word}</p>
        {additional_infomation && (
          <div className="flex flex-col w-80">
            <h3>Additional Context:</h3>
            <p className=" text-skin-muted text-lg">{additional_infomation}</p>
          </div>
        )}
      </div>
      {audio !== null && (
        <AudioPlayer
          audioPath={`/audioClips/${audio}.mp3`}
          onEnd={handleAudioEnd}
          playOnLoad={true}
        />
      )}
      <div className="flex flex-col pt-4 items-start w-80">
        <p>
          {questionType === 1
            ? "Choose the corresponding english word"
            : "Choose the corresponding sinhala word"}
        </p>
        <div className="flex flex-wrap justify-around items-start pt-2">
          {answers.map((answer) =>
            Object.hasOwn(answer, "sinhala") ? (
              <div
                key={answer.buttonLabel}
                onClick={() => setSelectedAnswer(answer.value)}
                className={`cursor-pointer hover:text-skin-accent flex flex-col items-center w-full my-1 rounded-lg border border-solid border-skin-base px-3 py-1 text-xs focus:outline-none sm:ml-2 sm:w-40 sm:text-base ${
                  selectedAnswer === answer.value
                    ? "text-skin-accent"
                    : "text-skin-muted"
                }`}
              >
                <p>{answer.buttonLabel}</p>
                <p className="text-skin-base">{answer.sinhala}</p>
              </div>
            ) : (
              <div key={answer.buttonLabel}>
                <button
                  key={answer.buttonLabel}
                  onClick={() => setSelectedAnswer(answer.value)}
                  className={`rounded-lg border border-skin-base px-3 py-1 text-xs hover:text-skin-accent focus:outline-none sm:ml-2 sm:text-base sm:w-full w-1/3 mx-2 mb-4 ${
                    selectedAnswer === answer.value
                      ? "text-skin-accent"
                      : "text-skin-muted"
                  }`}
                >
                  {answer.buttonLabel}
                </button>
                {answer.audio !== null && (
                  <AudioPlayer
                    audioPath={`/audioClips/${answer.audio}.mp3`}
                    onEnd={handleAudioEnd}
                  />
                )}
              </div>
            )
          )}
        </div>
        <button
          key="confirm-button"
          onClick={() => handleAnswer()}
          className="sm:w-80 w-1/3 mx-2 my-4 bg-skin-accent rounded-lg border border-skin-base px-3 py-1"
        >
          Confirm
        </button>
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
