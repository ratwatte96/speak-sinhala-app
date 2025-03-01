"use client";
//!Refactor

import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import { fetchWithToken } from "@/utils/fetch";
import { usePathname } from "next/navigation";
import { errorWithFile } from "@/utils/logger";

interface AudioPlayerProps {
  audioPath: string;
  onEnd?: () => void;
  playOnLoad?: boolean;
  display_text?: string;
  extra_text?: string;
  extraa_text?: string;
  onClick?: () => void;
  additionalClasses?: string;
  disabledOveride?: boolean;
  isButtonNoAudio?: boolean;
  isHard?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioPath,
  onEnd,
  playOnLoad = false,
  display_text,
  extra_text,
  extraa_text,
  onClick,
  additionalClasses = "",
  disabledOveride = false,
  isButtonNoAudio = false,
  isHard = false,
}) => {
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const pathname = usePathname();
  const quizId = pathname.split("/").pop();

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? ""
            : process.env.NEXT_PUBLIC_API_URL;
        const response = await fetchWithToken(
          `${baseUrl}/api/audio?path=${encodeURIComponent(
            audioPath
          )}&quizId=${quizId}`
        );

        if (response.ok) {
          const blob = await response.blob();
          setSrc(URL.createObjectURL(blob));
        } else {
          errorWithFile("Failed to fetch audio file.");
        }
      } catch (error) {
        errorWithFile(error);
      }
    };

    fetchAudioUrl();
  }, [audioPath, quizId]);

  useEffect(() => {
    if (!src) return;

    const newSound = new Howl({
      src: [src],
      format: ["mp3"],
      html5: true,
      onend: () => {
        setPlaying(false);
        onEnd?.();
      },
      onplay: () => setPlaying(true),
      onpause: () => setPlaying(false),
      onstop: () => setPlaying(false),
    });

    setSound(newSound);
    if (playOnLoad) newSound.play();

    return () => {
      newSound.unload();
      URL.revokeObjectURL(src);
    };
  }, [src, onEnd, playOnLoad]);

  const togglePlay = () => {
    onClick?.();
    if (!isButtonNoAudio) {
      playing ? sound?.pause() : sound?.play();
      setPlaying(!playing);
    }
  };

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`relative rounded-lg border-2 p-4 flex flex-col min-w-32 justify-center min-h-28 sm:min-h-28 ${
        isPressed ? "" : additionalClasses
      }`}
      onClick={togglePlay}
      disabled={disabledOveride || playing}
    >
      {display_text ? (
        <div className="flex flex-col items-center sm:w-full">
          <span>{display_text}</span>
          {extraa_text && <p className="text-skin-base">{extraa_text}</p>}
          {extra_text && <p className="text-skin-base">{extra_text}</p>}
          {!isHard && !isButtonNoAudio && (
            <span className="absolute text-lg bottom-0 right-0 pr-1 pb-1">
              &#x1F50A;
            </span>
          )}
        </div>
      ) : (
        <span className="ml-1 text-lg text-skin-accent">&#x1F50A;</span>
      )}
    </button>
  );
};
