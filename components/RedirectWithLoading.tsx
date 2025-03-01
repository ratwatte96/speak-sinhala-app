"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

const RedirectWithLoading = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

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
        router.replace("/read");
      } else {
        router.replace("/home");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen dark:bg-black">
      <div className="flex flex-col items-center justify-center ">
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
  );
};

export default RedirectWithLoading;
