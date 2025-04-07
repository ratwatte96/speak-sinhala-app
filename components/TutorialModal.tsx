"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";

export const TutorialModal = ({
  localStorageName,
  tutorialText,
  title,
  display = () => <></>,
}: {
  localStorageName: string;
  tutorialText: string[];
  title: string;
  display?: any;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    const firstTime = localStorage.getItem(localStorageName);
    setShowModal(firstTime === null);
  }, []);

  return (
    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      heading=""
      additionalClasses="h-screen w-screen flex items-center justify-center"
      removeClose={true}
    >
      <div className="bg-white dark:bg-black dark-base-border dark:border-gray-600 p-6 rounded-lg shadow-lg max-w-lg text-center w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <div className="flex justify-center text-black dark:text-white mt-2">
          {display()}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-base mt-3 leading-relaxed">
          {tutorialText[currentStep]}
        </p>
        <button
          className="mt-6 w-full bg-red-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => {
            if (currentStep + 1 < tutorialText.length) {
              setCurrentStep(currentStep + 1);
            } else {
              localStorage.setItem(localStorageName, "false");
              setShowModal(false);
            }
          }}
        >
          {currentStep + 1 < tutorialText.length ? "Next" : "Start Learning"}
        </button>
      </div>
    </Modal>
  );
};
