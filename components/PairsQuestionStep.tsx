"use client";

import { useCallback, useRef, useState } from "react";
import { AudioPlayer } from "./AudioPlayer";
import Toast, { ToastType } from "./Toast";

interface PairsQuestionStepProps {
  nextStep: (isMistake: boolean) => void;
  pairs: any[];
  sounds: string[];
  updateLives: () => void;
  isHard?: boolean;
}

export const PairsQuestionStep: React.FC<PairsQuestionStepProps> = ({
  nextStep,
  pairs,
  sounds,
  updateLives,
  isHard,
}) => {
  const toastMessageRef = useRef<string | null>("");
  const toastTypeRef = useRef<ToastType>("");
  const completePairs = useRef<string[]>([]);
  const wrongGuessCount = useRef<number>(0);

  const handleAudioEnd = useCallback(() => {
    console.log("Audio finished playing");
  }, []);

  const [selectedSinhala, setSelectedSinhala] = useState<string>("");
  const [selectedSound, setSelectedSound] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>("");

  const checkPair = (value: string, type: string) => {
    if (type === "sound") {
      if (selectedSinhala === "") return;
      const correctPair = pairs.find((element) => element.sound === value);

      if (
        correctPair.sound === value &&
        correctPair.sinhala === selectedSinhala
      ) {
        toastMessageRef.current = "Correct";
        toastTypeRef.current = "Correct";
        completePairs.current.push(value);
      } else {
        wrongGuessCount.current += 1;
        if (wrongGuessCount.current === 2) {
          updateLives();
          wrongGuessCount.current = 0;
        }
        toastMessageRef.current = `Incorrect! Correct Answer: ${correctPair.sinhala} `;
        toastTypeRef.current = "Incorrect";
      }
    } else {
      if (selectedSound === "") return;
      const correctPair = pairs.find((element) => element.sinhala === value);

      if (
        correctPair.sound === selectedSound &&
        correctPair.sinhala === value
      ) {
        toastMessageRef.current = "Correct";
        toastTypeRef.current = "Correct";
        completePairs.current.push(selectedSound);
      } else {
        wrongGuessCount.current += 1;
        if (wrongGuessCount.current === 2) {
          updateLives();
          wrongGuessCount.current = 0;
        }
        toastMessageRef.current = `Incorrect! Correct Answer: ${correctPair.english} `;

        toastTypeRef.current = "Incorrect";
      }
    }

    setSelectedSinhala("");
    setSelectedSound("");
    setToastMessage(toastMessageRef.current);
    setToastType(toastTypeRef.current);
  };

  const selectSinhala = (answer: string) => {
    if (answer === selectedSinhala) {
      setSelectedSinhala("");
    } else {
      setSelectedSinhala(answer);
    }
  };

  const selectSound = (answer: string) => {
    if (answer === selectedSound) {
      setSelectedSound("");
    } else {
      setSelectedSound(answer);
    }
  };
  return (
    <>
      <div className="flex flex-col items-start w-80">
        {isHard && <p className="text-skin-accent">Hard!!!</p>}
        <p>
          Tap the matching pairs. (You lose a heart each time you get two
          guesses wrong.)
        </p>
        <div className="flex justify-between w-full mt-4">
          <div>
            {pairs.map(({ id, sinhala, sound }) => (
              <div key={id}>
                <AudioPlayer
                  audioPath={`/audioClips/${sound}.mp3`}
                  // audioPath={`/audioClips/imFine.mp3`}
                  onEnd={handleAudioEnd}
                  display_text={sinhala}
                  onClick={() => {
                    selectSinhala(sinhala);
                    checkPair(sinhala, "sinhala");
                  }}
                  additionalClasses={
                    completePairs.current.includes(sound)
                      ? "text-skin-muted border-skin-base border-b-4 bg-skin-disabled"
                      : selectedSinhala === sinhala
                      ? "text-skin-accent border-skin-accent20 bg-rose-500/20"
                      : "text-skin-muted border-skin-base border-b-4"
                  }
                  disabledOveride={completePairs.current.includes(sound)}
                  isButtonNoAudio={isHard}
                />
              </div>
            ))}
          </div>
          <div>
            {sounds.map((sound, i) => (
              <button
                key={i}
                onClick={() => {
                  selectSound(sound);
                  checkPair(sound, "sound");
                }}
                className={`rounded-lg border-2 text-5xl mb-4 p-4 flex flex-col min-w-32 min-h-28 ${
                  completePairs.current.includes(sound)
                    ? "text-skin-muted border-skin-base border-b-4 bg-skin-disabled"
                    : selectedSound === sound
                    ? "text-skin-accent border-skin-accent20 bg-rose-500/20"
                    : "text-skin-muted border-skin-base border-b-4"
                }`}
                disabled={completePairs.current.includes(sound)}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>
        <button
          key="confirm-button"
          onClick={() => {
            nextStep(false);
            completePairs.current = [];
          }}
          className={`w-80 my-4 bg-skin-accent rounded-lg border border-0 border-skin-base px-3 py-1 ${
            completePairs.current.length !== pairs.length
              ? "text-skin-muted border-skin-base bg-skin-disabled"
              : ""
          }`}
          disabled={completePairs.current.length !== pairs.length}
        >
          Next
        </button>
      </div>
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          toastType={toastType}
        />
      )}
    </>
  );
};
