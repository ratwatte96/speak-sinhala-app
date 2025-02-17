"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function TutorialModal() {
  const firstTime = localStorage.getItem("firstTime");
  const [showModal, setShowModal] = useState(firstTime === null);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialText = [
    "This site will help you practice reading and speaking Sinhala. During the beta phase, only reading exercises are available.",
    "Our structured course includes 13 quiz-based units to help you master Sinhala reading. You can start with Unit 1 for free. No sign-up required!",
    "Unlock all units for free by signing up. Start learning today and make steady progress on your Sinhala journey!",
  ];

  return (
    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      heading=""
      additionalClasses="h-screen w-screen flex items-center justify-center"
      removeClose={true}
    >
      <div className="bg-white dark:bg-black dark:border dark:border-solid dark:border-gray-600 p-6 rounded-lg shadow-lg max-w-lg text-center w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Learn Sinhala
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-base mt-3 leading-relaxed">
          {tutorialText[currentStep]}
        </p>
        <button
          className="mt-6 w-full bg-red-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => {
            if (currentStep + 1 < tutorialText.length) {
              setCurrentStep(currentStep + 1);
            } else {
              localStorage.setItem("firstTime", "false");
              setShowModal(false);
            }
          }}
        >
          {currentStep + 1 < tutorialText.length ? "Next" : "Start Learning"}
        </button>
      </div>
    </Modal>
  );
}
