"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleRouting = (value: string) => {
    router.push(`/${value}`);
  };
  return (
    <main className="flex min-h-screen items-center p-24 bg-skin-base">
      <button
        onClick={() => handleRouting("vowels")}
        className="w-24 rounded-lg border border-skin-base mx-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
      >
        Vowels
      </button>
      <button
        onClick={() => handleRouting("consonants")}
        className="w-24 rounded-lg border border-skin-base mx-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
      >
        Consonants
      </button>
      <button
        onClick={() => handleRouting("numbers")}
        className="w-24 rounded-lg border border-skin-base mx-4 px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
      >
        Numbers
      </button>
    </main>
  );
}
