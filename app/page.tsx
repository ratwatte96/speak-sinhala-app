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
          onClick={() => handleRouting("vowels")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Vowels
        </button>
        <button
          onClick={() => handleRouting("consonants")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Consonants
        </button>
        <button
          onClick={() => handleRouting("numbers/0")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (0-10)
        </button>
        <button
          onClick={() => handleRouting("numbers/1")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (10-20)
        </button>
        <button
          onClick={() => handleRouting("numbers/2")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (20-30)
        </button>
        <button
          onClick={() => handleRouting("numbers/3")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (30-40)
        </button>
        <button
          onClick={() => handleRouting("numbers/4")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (40-50)
        </button>
        <button
          onClick={() => handleRouting("numbers/5")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (50-60)
        </button>
        <button
          onClick={() => handleRouting("numbers/6")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (60-70)
        </button>
        <button
          onClick={() => handleRouting("numbers/7")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (70-80)
        </button>
        <button
          onClick={() => handleRouting("numbers/8")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (80-90)
        </button>
        <button
          onClick={() => handleRouting("numbers/9")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (90-100)
        </button>
        <button
          onClick={() => handleRouting("numbers/10")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (100-1000)
        </button>
        <button
          onClick={() => handleRouting("numbers/11")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (1000-10000)
        </button>
        <button
          onClick={() => handleRouting("numbers/12")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (10000-20000)
        </button>
        <button
          onClick={() => handleRouting("numbers/13")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (30000-1000000)
        </button>
      </div>
    </main>
  );
}
