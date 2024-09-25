"use client";

import { AudioPlayer } from "./AudioPlayer";

interface NewLettersStepProps {
  nextStep: () => void;
  data: any[];
}

export const NewLettersStep: React.FC<NewLettersStepProps> = ({
  nextStep,
  data,
}) => {
  return (
    <div className="sm:w-2/3 w-full text-sm sm:text-base">
      <p className="flex flex-col items-center text-skin-base w-full">
        There are 42 consonants in sinhala. Checkout these three characters and
        how we write their sounds in English:
      </p>
      {data.map(({ sound, sinhala, englishWord }, i) => (
        <div key={i} className="flex mt-4">
          <AudioPlayer
            // audioPath={`/audioClips/${sound}.mp3`}
            audioPath={`/audioClips/imFine.mp3`}
            display_text={sinhala}
            onClick={() => {}}
          />
          <div className="ml-4 min-h-28 flex flex-col justify-center">
            <p>{sound}</p>
            <p>{`like in '${englishWord}'`}</p>
          </div>
        </div>
      ))}
      <div className="w-full flex justify-center">
        <button
          key="confirm-button"
          onClick={nextStep}
          className="w-80 my-4 bg-skin-accent rounded-lg border border-0 border-skin-base px-3 py-1"
        >
          Start
        </button>
      </div>
    </div>
  );
};
