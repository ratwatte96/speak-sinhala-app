"use client";

import React, { useState, useEffect } from "react";
import { Howl } from "howler";

interface AudioPlayerProps {
  audioPath: string;
  onEnd: () => void;
  playOnLoad?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioPath,
  onEnd,
  playOnLoad = false,
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
    setPlaying(!playing);
  };

  return (
    <div className="bg-white w-10">
      <button onClick={togglePlay} disabled={!sound}>
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
};
