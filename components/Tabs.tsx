"use client";

import { BookOpen, MessageSquare } from "lucide-react";
import { useState } from "react";

interface TabsProps {
  readComponent: React.ReactNode;
  speakComponent: React.ReactNode;
}

export default function Tabs({ readComponent, speakComponent }: TabsProps) {
  const [activeTab, setActiveTab] = useState<"READ" | "SPEAK">("READ");

  return (
    <div className="flex flex-col w-[35rem]">
      <div className="flex border-b text-xl">
        <button
          className={`px-4 py-2 flex ${
            activeTab === "READ"
              ? "border-b-2 border-green-500 text-green-500 font-bold"
              : "text-gray-500 transition-transform transform hover:scale-105 hover:shadow-lg"
          }`}
          onClick={() => setActiveTab("READ")}
        >
          <span className="pr-2">READ</span>
          <BookOpen />
        </button>
        <button
          className={`px-4 py-2 flex ${
            activeTab === "SPEAK"
              ? "border-b-2 border-green-500 text-green-500 font-bold"
              : "text-gray-500 transition-transform transform hover:scale-105 hover:shadow-lg"
          }`}
          onClick={() => setActiveTab("SPEAK")}
        >
          <span className="pr-2">SPEAK</span>
          <MessageSquare />
        </button>
      </div>

      <div className="mt-4 w-full overflow-y-auto">
        {activeTab === "READ" ? readComponent : speakComponent}
      </div>
    </div>
  );
}
