"use client";

import { useState } from "react";
import { CompletionBar } from "./CompletionBar";
import { CustomQuizForm } from "./CustomQuizForm";
import Lessons from "./Lessons";
import TutorialModal from "./TutorialModal";

interface ReadPageProps {
  quizCompletionPercentage: number;
  decoded: any;
  sinhalaObjects: any[];
  isPremium: boolean;
  units: any[];
  readStatus: object;
}

export default function ReadPage({
  quizCompletionPercentage,
  decoded,
  sinhalaObjects,
  isPremium,
  units,
  readStatus,
}: ReadPageProps) {
  return (
    <div className="mx-8 sm:w-96">
      <h1 className="font-serif mb-1 text-xl">READ</h1>
      <CompletionBar quizPercentage={quizCompletionPercentage} />
      {decoded && (
        <CustomQuizForm
          dropDownLetters={sinhalaObjects}
          isPremium={isPremium}
        />
      )}
      <div className="mt-2">
        <Lessons unitData={units} readStatus={readStatus} loggedIn={decoded} />
      </div>
      <TutorialModal />
    </div>
  );
}
