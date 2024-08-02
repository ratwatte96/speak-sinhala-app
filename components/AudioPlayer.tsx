"use client";

import React, { useState, useEffect } from "react";
import { Howl } from "howler";

interface AudioPlayerProps {
  src: string;
  onEnd: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, onEnd }) => {
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);

  useEffect(() => {
    const newSound = new Howl({
      src: [src],
      html5: true, // Use HTML5 Audio to enable streaming and better mobile performance
      onend: onEnd,
    });
    setSound(newSound);
    newSound.play();

    return () => {
      newSound.unload();
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
