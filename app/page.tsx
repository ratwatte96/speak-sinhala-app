"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleRouting = (value: string) => {
    router.push(`/${value}`);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base">
      <button
        onClick={() => handleRouting("letters")}
        className="w-24 rounded-lg border border-skin-base px-3 py-1 text-xs text-skin-muted hover:text-skin-accent focus:outline-none sm:ml-2 sm:w-40 sm:text-base"
      >
        Letters
      </button>
    </main>
  );
}
