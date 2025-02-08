"use client";
import React, { useState } from "react";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import Quiz from "./Quiz";
import { fetchWithToken } from "@/utils/fetch";
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
    <div className="flex justify-between w-1/4">
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
      <button
        className="flex items-center justify-center rounded-lg border border-skin-base px-2 py-1 text-xs font-medium text-skin-base focus:z-10 focus:outline-none focus:ring-4 sm:px-4 sm:py-2 sm:text-sm"
        onClick={handleRouting}
      >
        Start Quiz
      </button>
      <p>{message}</p>
    </div>
  );
};
