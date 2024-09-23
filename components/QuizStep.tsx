"use client";

import { useCallback, useRef, useState } from "react";
import Toast, { ToastType } from "./Toast";
import { AudioPlayer } from "./AudioPlayer";
import Modal from "./Modal";
import { PairsQuestion } from "./PairsQuestion";

type Answer = {
  sinhala?: string;
  buttonLabel: string;
  value: string;
  audio?: string;
  id: number;
};

export interface QuizData {
  answers: Answer[];
  correctAnswer: string;
  question_word: string;
  additonal_information?: string;
  questionType?: number;
  audio?: string;
  specific_note?: string;
  isNew?: boolean;
}

export interface QuizStepProps extends QuizData {
  nextStep: () => void;
  updateLives: () => void;
  lives: number;
}

export const QuizStep: React.FC<QuizStepProps> = ({
  answers,
  correctAnswer,
  question_word,
  additonal_information,
  updateLives,
  lives,
  audio = "imFine",
  nextStep,
  questionType = 1,
  specific_note,
  isNew = false,
}) => {
  const toastMessageRef = useRef<string | null>("");
  const toastTypeRef = useRef<ToastType>("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);

  const handleAnswer = () => {
    if (selectedAnswer === correctAnswer) {
      toastMessageRef.current = "Correct";
      toastTypeRef.current = "Correct";
      setSelectedAnswer("");
      if (specific_note) {
        setShowModal(true);
      } else {
        nextStep();
      }
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

  const tempTestPairs = [
    ["pa", "ප"],
    ["ta", "ත"],
    ["ma", "ම"],
    ["ba", "බ"],
    ["tha", "ථ"],
  ];

  return (
    <div className="flex flex-col items-center">
      {false ? (
        <>
          <div className="flex flex-col justify-center items-center my-4">
            {isNew && <p>New!!!</p>}
            {(questionType === 3 || isNew) && audio ? (
              <AudioPlayer
                audioPath={`/audioClips/${audio}.mp3`}
                onEnd={handleAudioEnd}
                playOnLoad={true}
                display_text={questionType === 3 ? undefined : question_word}
              />
            ) : (
              <p className="text-skin-base text-5xl mb-4">{question_word}</p>
            )}
            {/* <div
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className="hover:text-skin-accent cursor-pointer text-skin-base text-5xl mb-4 relative"
          >
            {isNew && visible && (
              <span className="absolute top-3/4 left-full z-10 rounded-md border border-solid border-white px-3 py-1 text-base text-white shadow-lg bg-skin-base">
                {correctAnswer}
              </span>
            )}
          </div> */}
            {additonal_information && (
              <div className="flex flex-col w-80">
                <h3>Additional Context:</h3>
                <p className="text-xs sm:text-base text-skin-muted">
                  {additonal_information}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start w-80">
            <p>
              {questionType === 1
                ? "Choose the corresponding english word and click confirm"
                : questionType === 2
                ? `Select the correct character for the '${question_word}'`
                : "What sound does this make?"}
            </p>
            <div className="flex flex-wrap justify-around items-start pt-2">
              {answers.map((answer) =>
                Object.hasOwn(answer, "sinhala") ? (
                  <div
                    key={answer.id}
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
                  <div key={answer.id}>
                    {(questionType === 2 || questionType === 3) &&
                    answer.audio !== null ? (
                      <AudioPlayer
                        audioPath={`/audioClips/${answer.audio}.mp3`}
                        onEnd={handleAudioEnd}
                        display_text={answer.buttonLabel}
                        onClick={() => setSelectedAnswer(answer.value)}
                        additionalClasses={
                          selectedAnswer === answer.value
                            ? "text-skin-accent border-skin-accent20 bg-rose-500/20"
                            : "text-skin-muted border-skin-base border-b-4"
                        }
                      />
                    ) : (
                      <button
                        onClick={() => setSelectedAnswer(answer.value)}
                        className={`rounded-lg border border-2 px-3 py-1 text-xs hover:text-skin-accent focus:outline-none sm:text-base w-80 mb-4 ${
                          selectedAnswer === answer.value
                            ? "text-skin-accent border-skin-accent20 bg-rose-500/20"
                            : "text-skin-muted border-skin-base border-b-4"
                        }`}
                      >
                        {answer.buttonLabel}
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
            <button
              key="confirm-button"
              onClick={() => handleAnswer()}
              className="w-80 my-4 bg-skin-accent rounded-lg border border-0 border-skin-base px-3 py-1"
            >
              Confirm
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-start w-80">
            <PairsQuestion
              nextStep={nextStep}
              pairs={tempTestPairs}
              sounds={tempTestPairs
                .map((pair) => pair[0])
                .sort((a, b) => 0.5 - Math.random())}
              handleToast={(message, type: any) => {
                setToastMessage(message);
                setToastType(type);
              }}
            />
          </div>
        </>
      )}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          toastType={toastType}
        />
      )}
      {specific_note && (
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            nextStep();
          }}
          heading={"Note"}
        >
          {specific_note}
        </Modal>
      )}
    </div>
  );
};
