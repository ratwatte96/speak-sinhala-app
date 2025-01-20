"use client";

import React, { useState, useEffect } from "react";
import { Howl } from "howler";

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
  additionalClasses,
  disabledOveride = false,
  isButtonNoAudio = false,
  isHard = false,
}) => {
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [src, setSrc] = useState<string | null>(null); // Hold the fetched audio src URL
  const [isPressed, setIsPressed] = useState(false);

  // Event handler for when the mouse button is pressed down
  const handleMouseDown = () => {
    setIsPressed(true);
  };

  // Event handler for when the mouse button is released
  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Event handler for when the mouse leaves the button (in case the user moves the cursor away while clicking)
  const handleMouseLeave = () => {
    setIsPressed(false);
  };
  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        let response;
        if (process.env.NODE_ENV === "development") {
          response = await fetch(
            `/api/audio?path=${encodeURIComponent(audioPath)}`
          );
        } else {
          response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/api/audio?path=${encodeURIComponent(audioPath)}`
          );
        }

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setSrc(url); // Set the fetched URL
        } else {
          console.error("Failed to fetch audio file.");
        }
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    };

    fetchAudioUrl();
  }, [audioPath]);

  const onEndCombined = () => {
    if (onEnd) onEnd();
    setPlaying(false);
  };

  useEffect(() => {
    if (!src) return;

    const newSound = new Howl({
      src: [src],
      format: ["mp3"],
      html5: true, // Enable HTML5 for better mobile support
      onend: onEndCombined,
      onplay: () => setPlaying(true),
      onpause: () => setPlaying(false),
      onstop: () => setPlaying(false),
    });

    setSound(newSound);
    if (playOnLoad) {
      newSound.play();
    }
    return () => {
      newSound.unload();
      URL.revokeObjectURL(src); // Clean up the object URL after it's used
    };
  }, [src, onEnd]);

  const togglePlay = () => {
    if (onClick) onClick();
    if (!isButtonNoAudio) {
      if (playing) {
        sound?.pause();
      } else {
        sound?.play();
      }
      setPlaying(!playing);
    }
  };

  return (
    <>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={
          isPressed
            ? "relative rounded-lg border-2 text-5xl mb-4 p-4 flex flex-col min-w-32 justify-center min-h-28"
            : "relative rounded-lg border-2 text-5xl mb-4 p-4 flex flex-col min-w-32 justify-center min-h-28" +
              " " +
              additionalClasses
        }
        onClick={togglePlay}
        //! disabled={!sound || disabledOveride} TEMP until we get more sound recordings
        disabled={disabledOveride}
      >
        {display_text ? (
          extra_text ? (
            <>
              <span>{display_text}</span>
              <div
                key={display_text}
                className={"flex flex-col items-center w-full sm:text-base"}
              >
                <span>
                  {extraa_text ?? (
                    <p className="text-skin-base ">{extraa_text}</p>
                  )}
                </span>
                {extra_text ?? <p className="text-skin-base">{extra_text}</p>}
                {!isHard && (
                  <span
                    className="absolute bottom-0 right-0 pr-1
                  pb-1"
                  >
                    &#x1F50A;
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <span>{display_text}</span>
              {!isButtonNoAudio && !isHard && (
                <div className="flex justify-end">
                  <span
                    className="text-base absolute bottom-0 right-0 pr-1
                  pb-1"
                  >
                    &#x1F50A;
                  </span>
                </div>
              )}
            </>
          )
        ) : (
          <span className="ml-1 text-skin-accent"> &#x1F50A;</span>
        )}
      </button>
    </>
  );
};
