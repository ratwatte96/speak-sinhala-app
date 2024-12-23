"use client";
import React, { useState } from "react";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import Quiz from "./Quiz";
// import ChevronDownIcon from "../../public/chevron-down.svg";
// import FilterIcon from "../../public/filter.svg";

interface CustomQuizProps {
  dropDownLetters: Array<{ name: string; value: string }>;
}

export const CustomQuiz: React.FC<CustomQuizProps> = ({ dropDownLetters }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [quizData, setQuizData] = useState([]);

  const getQuizData = async () => {
    try {
      const response = await fetch("/api/quiz-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedItems }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const quizData = await response.json();
      setQuizData(quizData);
    } catch (error: any) {}
  };

  return (
    <div className="flex flex-col">
      {quizData.length === 0 ? (
        <>
          <div>{...selectedItems}</div>
          <MultiSelectDropdown
            id="filters"
            buttonLabel="Choose Letters"
            items={dropDownLetters}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            // iconStart={<FilterIcon />}
            // iconEnd={<ChevronDownIcon />}
          />
          <button
            className="flex items-center justify-center rounded-lg border border-skin-base px-2 py-1 text-xs font-medium text-skin-base focus:z-10 focus:outline-none focus:ring-4 sm:px-4 sm:py-2 sm:text-sm"
            onClick={getQuizData}
          >
            Start Quiz
          </button>
        </>
      ) : (
        <>
          <Quiz
            steps={quizData}
            startingLives={100}
            quiz_title={"Custom Quiz"}
          />
        </>
      )}
    </div>
  );
};
