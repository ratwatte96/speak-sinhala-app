"use client";

import { useCallback, useRef, useState } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { ToastType } from "./Toast";

interface PairsQuestionProps {
  pairs: any[];
  sounds: string[];
  handleToast: (message: string, type: string) => void;
}

export const PairsQuestion: React.FC<PairsQuestionProps> = ({
  pairs,
  sounds,
  handleToast,
}) => {
  const toastMessageRef = useRef<string | null>("");
  const toastTypeRef = useRef<ToastType>("");
  const completePairs = useRef<string[]>([]);

  const handleAudioEnd = useCallback(() => {
    console.log("Audio finished playing");
  }, []);
  const [selectedSinhala, setSelectedSinhala] = useState<string>("");
  const [selectedSound, setSelectedSound] = useState<string>("");

  const checkPair = (value: string, type: string) => {
    const correctPair = pairs.find((element) => element.includes(value));

    if (type === "sound") {
      if (selectedSinhala === "") return;

      if (correctPair[0] === value && correctPair[1] === selectedSinhala) {
        toastMessageRef.current = "Correct";
        toastTypeRef.current = "Correct";
        completePairs.current.push(value);
      } else {
        toastMessageRef.current = "Incorrect";
        toastTypeRef.current = "Incorrect";
      }
    } else {
      if (selectedSound === "") return;

      if (correctPair[0] === selectedSound && correctPair[1] === value) {
        toastMessageRef.current = "Correct";
        toastTypeRef.current = "Correct";
        completePairs.current.push(selectedSound);
      } else {
        toastMessageRef.current = "Incorrect";
        toastTypeRef.current = "Incorrect";
      }
    }

    setSelectedSinhala("");
    setSelectedSound("");
    // console.log("toastMessageRef", toastMessageRef);
    handleToast(toastMessageRef.current, toastTypeRef.current);
  };

  console.log("completePairs", completePairs.current);
  return (
    <>
      <div className="flex flex-col items-start w-80">
        <p>Tap the matching pairs</p>
        <div className="flex justify-between w-full mt-4">
          <div>
            {pairs.map(([sound, sinhala], i) => (
              <div key={i}>
                <AudioPlayer
                  // audioPath={`/audioClips/${sound}.mp3`}
                  audioPath={`/audioClips/imFine.mp3`}
                  onEnd={handleAudioEnd}
                  display_text={sinhala}
                  onClick={() => {
                    setSelectedSinhala(sinhala);
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
                />
              </div>
            ))}
          </div>
          <div>
            {sounds.map((sound, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedSound(sound);
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
          onClick={() => {}}
          className="w-80 my-4 bg-skin-accent rounded-lg border border-0 border-skin-base px-3 py-1"
        >
          Confirm
        </button>
      </div>
    </>
  );
};
