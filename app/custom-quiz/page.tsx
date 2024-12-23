import React from "react";
import { CustomQuiz } from "@/components/CustomQuiz";

export default function CustomQuizPage() {
  const sinhalaCharacters = [
    "ක",
    "ඛ",
    "ග",
    "ඝ",
    "ඞ",
    "ඟ",
    "ච",
    "ඡ",
    "ජ",
    "ඣ",
    "ඤ",
    "ඥ",
    "ඦ",
    "ට",
    "ඨ",
    "ඩ",
    "ඪ",
    "ණ",
    "ඬ",
    "ත",
    "ථ",
    "ද",
    "ධ",
    "න",
    "ඳ",
    "ප",
    "ඵ",
    "බ",
    "භ",
    "ම",
    "ඹ",
    "ය",
    "ර",
    "ල",
    "ළ",
    "ව",
    "හ",
    "ශ",
    "ෂ",
    "ස",
    "ෆ",
    "අ",
    "ආ",
    "ඇ",
    "ඈ",
    "ඉ",
    "ඊ",
    "උ",
    "ඌ",
    "එ",
    "ඒ",
    "ඓ",
    "ඔ",
    "ඕ",
    "ඖ",
    "ඍ",
    "ඎ",
    "ඏ",
    "ඐ",
  ];

  const sinhalaObjects = sinhalaCharacters.map((char) => ({
    value: char,
    name: char,
  }));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <CustomQuiz dropDownLetters={sinhalaObjects} />
    </main>
  );
}
