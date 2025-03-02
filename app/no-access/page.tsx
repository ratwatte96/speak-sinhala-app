"use client";
import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";

export default function NoAccessPage() {
  const router = useRouter();

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-black">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="p-6 bg-white shadow-lg rounded-lg text-center dark:bg-black dark:border dark:border-solid dark:border-gray-400 w-80 mt-6">
          <h1 className="text-md sm:text-xl font-semibold text-red-600 dark:text-red-500">
            Access Denied
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            You don’t have access to this quiz. Please check your account or try
            a different quiz.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-all"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
}
