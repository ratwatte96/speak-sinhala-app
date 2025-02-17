"use client";

import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function VerificationSuccess() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen items-center justify-center bg-green-50 dark:bg-black">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="w-80 p-6 bg-white shadow-lg rounded-lg text-center dark:bg-black dark:border dark:border-solid dark:border-gray-400 mt-6">
          <h1 className="text-md sm:text-xl font-semibold text-green-600 dark:text-green-500">
            Email Verified!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Your email has been successfully verified. You can now log in and
            start using your account.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Go to Login
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
