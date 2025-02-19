"use client";

import { LoaderCircle } from "lucide-react";

export default function CalculatingResultsScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-black">
      <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg dark:bg-black dark:border dark:border-solid dark:border-gray-600">
        {/* Loader Icon for Calculating Results */}
        <LoaderCircle className="text-green-500 w-24 h-24 mb-6 animate-spin" />

        <h2 className="text-xl font-semibold text-gray-800 text-center dark:text-white">
          Calculating Results...
        </h2>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          Please wait while we process your answers. This won't take long! ⏳
        </p>
      </div>
    </div>
  );
}
