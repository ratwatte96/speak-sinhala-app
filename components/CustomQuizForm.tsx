"use client";
import React, { useState } from "react";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import Quiz from "./Quiz";
import { useRouter } from "next/navigation";
// import ChevronDownIcon from "../../public/chevron-down.svg";
// import FilterIcon from "../../public/filter.svg";

interface CustomQuizProps {
  dropDownLetters: Array<{ name: string; value: string }>;
  isPremium: boolean;
}

export const CustomQuizForm: React.FC<CustomQuizProps> = ({
  dropDownLetters,
  isPremium,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleRouting = () => {
    if (!isPremium) {
      setMessage("Need premium to use feature");
      return;
    }
    if (selectedItems.length !== 5) {
      setMessage("Please select five letters");
      return;
    }

    const encodedLetters = encodeURIComponent(JSON.stringify(selectedItems));
    router.push(`/custom-quiz?letters=${encodedLetters}`);
  };

  return (
    <div className="flex pb-4 justify-between items-end border rounded-lg p-3 shadow-md bg-white flex  text-xs sm:text-sm mx-auto my-3">
      <div>
        <h2 className="text-md font-semibold">Custom Quiz</h2>
        <p className="text-gray-500 text-xs/4 mt-1 sm:text-sm/4">
          Select up to 5 letters/accents you would like to practice and click
          start.
        </p>
      </div>
      <div className="ml-2">
        <MultiSelectDropdown
          id="filters"
          buttonLabel={
            selectedItems.length !== 0
              ? selectedItems.join(", ")
              : "Choose Letters"
          }
          items={dropDownLetters}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          // iconStart={<FilterIcon />}
          // iconEnd={<ChevronDownIcon />}
        />
      </div>
      <button
        className="flex items-center justify-center bg-green-500 ml-2 p-1 h-8 rounded-md w-28 text-xs font-medium text-black focus:z-10 focus:outline-none focus:ring-4"
        onClick={handleRouting}
      >
        Start Quiz
      </button>
      <p>{message}</p>
    </div>
  );
};
