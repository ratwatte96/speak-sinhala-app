"use client";

import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import Logo from "@/components/Logo";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="p-6 bg-white shadow-lg rounded-lg text-center dark:bg-black dark:border dark:border-solid dark:border-gray-400 w-80 mt-6">
          <h1 className="text-md sm:text-xl font-semibold text-gray-800 dark:text-white">
            Something Went Wrong
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            An unexpected error has occurred. Please try again in a few minutes.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
}
