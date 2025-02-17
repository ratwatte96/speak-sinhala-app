"use client";

import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function VerificationError() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen items-center justify-center bg-red-50 dark:bg-black">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="p-6 bg-white shadow-lg rounded-lg text-center dark:bg-black w-80 dark:border dark:border-solid dark:border-gray-400 mt-6">
          <h1 className="text-md sm:text-xl font-semibold text-red-600 dark:text-red-500">
            Verification Failed
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            The verification link is invalid or has expired. Please request a
            new verification email.
          </p>
          <a
            href="/resend-verification"
            className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-all"
          >
            Resend Verification Email
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
