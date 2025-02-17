export default function Speak() {
  return (
    <div className="flex min-h-screen flex-col pb-24 animate-fadeIn">
      <div className="mx-6 mt-10 ">
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
