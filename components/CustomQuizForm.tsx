"use client";
import React, { useState } from "react";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
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
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    const encodedLetters = encodeURIComponent(JSON.stringify(selectedItems));
    router.push(`/custom-quiz?letters=${encodedLetters}`);
  };

  return (
    <div className="card-container flex justify-between items-end mx-auto my-3">
      <div className="w-2/5">
        <h2 className="text-lg">Custom Quiz</h2>
        <p className="text-gray-500 text-xs/4">
          Select up to 5 letters you would like to practice and click start.
        </p>
      </div>
      <div className="w-1/2">
        <p className="text-center mb-1 text-red-600 text-xs sm:text-sm">
          {message}
        </p>
        <div className="flex justify-center item-center">
          <div className="w-3/5 flex flex-col items-end">
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
            className="btn-primary ml-2 h-8 text-xs font-medium w-2/5"
            onClick={handleRouting}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
};
