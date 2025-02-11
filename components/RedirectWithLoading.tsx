"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center ">
        <p className="text-4xl font-semibold text-gray-800 md:text-6xl lg:text-8xl mb-2">
          Loading App
        </p>
        <p className="text-sm text-gray-800 mb-4 md:text-lg lg:text-xl">
          Please wait a few moments...
        </p>
      </div>

      <div className="relative w-60 md:w-80 lg:w-96 h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-800 transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>

        <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default RedirectWithLoading;
