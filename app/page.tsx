"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleRouting = (value: string) => {
    router.push(`/${value}`);
  };
  return (
    <main className="flex items-center justify-center min-h-screen bg-skin-base">
      <div className="flex flex-row flex-wrap w-80 items-center justify-center">
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
          onClick={() => handleRouting("numbers/10")}
          className="w-24 rounded-lg border border-skin-base m-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
        >
          Numbers (10-20)
        </button>
      </div>
    </main>
  );
}
