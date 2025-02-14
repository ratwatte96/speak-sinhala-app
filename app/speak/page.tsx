import { CompletionBar } from "@/components/CompletionBar";

export default function Speak() {
  return (
    <div className="flex min-h-screen flex-col mt-10 pb-24">
      <div className="mx-4">
        <h1 className="font-serif mb-1 text-xl">SPEAK</h1>
        <div className="relative w-full h-3 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-400 dark:bg-gray-500 transition-all duration-100"
            style={{ width: `0%` }}
          ></div>

          <div className="absolute inset-0 flex items-center justify-center text-xs text-black dark:text-white font-semibold">
            0%
          </div>
        </div>

        <div className="text-center h-96 flex items-center justify-center text-lg">
          🎤 Speak section coming soon!
        </div>
      </div>
    </div>
  );
}
