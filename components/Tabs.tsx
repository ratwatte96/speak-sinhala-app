"use client";

import { useState } from "react";

interface TabsProps {
  readComponent: React.ReactNode;
  speakComponent: React.ReactNode;
}

export default function Tabs({ readComponent, speakComponent }: TabsProps) {
  const [activeTab, setActiveTab] = useState<"READ" | "SPEAK">("READ");

  return (
    <div className="flex flex-col w-[35rem]">
      {/* Tab Navigation */}
      <div className="flex border-b text-xl">
        <button
          className={`px-4 py-2 ${
            activeTab === "READ"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("READ")}
        >
          READ
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "SPEAK"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("SPEAK")}
        >
          SPEAK
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4 w-full">
        {activeTab === "READ" ? readComponent : speakComponent}
      </div>
    </div>
  );
}
