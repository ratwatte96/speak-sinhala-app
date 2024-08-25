"use client";
import { LivesCounter } from "@/components/LivesCounter";
import { StreakCounter } from "@/components/StreakCounter";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleRouting = (value: string) => {
    router.push(`/${value}`);
  };

  return (
    <main className="flex items-center flex-col justify-center min-h-screen bg-skin-base">
      <div className="flex justify-start w-56 sm:w-40">
        <div className="flex justify-start text-skin-base">
          <StreakCounter />
        </div>
        <div className="flex justify-start text-skin-base">
          <LivesCounter />
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-80 sm:w-1/2 items-center justify-center">
        <button
          onClick={() => handleRouting("consonants")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Speak
        </button>
        <button
          disabled
          onClick={() => handleRouting("consonants")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Read
        </button>

        <button
          disabled
          onClick={() => handleRouting("vowels")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Read & Speak
        </button>
      </div>
    </main>
  );
}
