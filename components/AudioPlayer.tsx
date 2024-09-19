"use client";

import React, { useState, useEffect } from "react";
import { Howl } from "howler";

interface AudioPlayerProps {
  audioPath: string;
  onEnd: () => void;
  playOnLoad?: boolean;
  display_text?: string;
  onClick?: () => void;
  additionalClasses?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioPath,
  onEnd,
  playOnLoad = false,
  display_text = "Play",
  onClick,
  additionalClasses,
}) => {
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [src, setSrc] = useState<string | null>(null); // Hold the fetched audio src URL

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const response = await fetch(
          `/api/audio?path=${encodeURIComponent(audioPath)}`
        );
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

  useEffect(() => {
    if (!src) return;

    const newSound = new Howl({
      src: [src],
      html5: true, // Enable HTML5 for better mobile support
      onend: onEnd,
    });

    setSound(newSound);
    if (playOnLoad) {
      console.log(playOnLoad);
      newSound.play();
    }
    return () => {
      newSound.unload();
      URL.revokeObjectURL(src); // Clean up the object URL after it's used
    };
  }, [src, onEnd]);

  const togglePlay = () => {
    if (playing) {
      sound?.pause();
    } else {
      sound?.play();
    }
    if (onClick) onClick();
    setPlaying(!playing);
  };

  return (
    <>
      <button
        className={
          "rounded-lg border-2 text-5xl mb-4 p-4 flex flex-col min-w-32" +
          " " +
          additionalClasses
        }
        onClick={togglePlay}
        disabled={!sound}
      >
        {display_text}
        <button className="flex justify-end">
          <span className="text-base ml-1 text-skin-accent"> &#x1F50A;</span>
        </button>
      </button>
    </>
  );
};
