"use client";

import { useState } from "react";

interface TabsProps {
  readComponent: React.ReactNode;
  speakComponent: React.ReactNode;
}

export default function Tabs({ readComponent, speakComponent }: TabsProps) {
  const [activeTab, setActiveTab] = useState<"READ" | "SPEAK">("READ");

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tab Navigation */}
      <div className="flex border-b">
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
      <div className="mt-4">
        {activeTab === "READ" ? readComponent : speakComponent}
      </div>
    </div>
  );
}
