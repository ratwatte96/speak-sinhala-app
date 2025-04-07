"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import ReadPageMobile from "./ReadPageMobile";
import ReadPageDesktop from "./ReadPageDesktop";

interface ReadPageProps {
  quizCompletionPercentage: number;
  decoded: any;
  sinhalaObjects: any[];
  isPremium: boolean;
  units: any[];
  readStatus: object;
  userData: any;
}

export default function ReadPage({
  quizCompletionPercentage,
  decoded,
  sinhalaObjects,
  isPremium,
  units,
  readStatus,
  userData,
}: ReadPageProps) {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState<any>(undefined);
  useEffect(() => {
    const screenWidth = window.innerWidth;

    // Simulate progress increase over 2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 5 : 100));
    }, 100);

    // Redirect after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (screenWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="flex-col-center justify-center w-full h-full md:h-screen dark:bg-black">
        {isMobile === undefined ? (
          <div className="flex-col-center justify-center min-h-[80vh]">
            <div className="flex-col-center justify-center ">
              <Logo width={160} height={120} textSize={"text-5xl"} />
              <p className="text-sm text-gray-600 mb-4 md:text-lg lg:text-xl dark:text-white mt-2">
                Please wait a few moments...
              </p>
            </div>

            <div className="relative w-60 md:w-80 lg:w-96 h-3 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 dark:bg-gray-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>

              <div className="absolute text-xs sm:text-sm inset-0 flex items-center justify-center text-black dark:text-white font-semibold">
                {progress}%
              </div>
            </div>
          </div>
        ) : isMobile ? (
          <ReadPageMobile
            quizCompletionPercentage={quizCompletionPercentage}
            decoded={decoded}
            sinhalaObjects={sinhalaObjects}
            isPremium={isPremium}
            units={units}
            readStatus={readStatus}
          />
        ) : (
          <ReadPageDesktop
            quizCompletionPercentage={quizCompletionPercentage}
            decoded={decoded}
            sinhalaObjects={sinhalaObjects}
            isPremium={isPremium}
            units={units}
            readStatus={readStatus}
            userData={userData}
          />
        )}
      </div>
    </>
  );
}
