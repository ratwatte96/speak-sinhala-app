"use client";
import { SinhalaDisplay } from "@/components/SinhalaDisplay";
import { useState } from "react";

export default function Test() {
  const [phonetic, setPhonetic] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base">
      <input
        type="text"
        id="phonetic"
        value={phonetic}
        onChange={(e) => setPhonetic(e.target.value)}
        required
      />
      <SinhalaDisplay phonetic={phonetic} />
    </main>
  );
}
