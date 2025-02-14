import React, { useState, useEffect, useRef, ChangeEvent } from "react";

interface MultiSelectDropdownProps {
  id: string;
  buttonLabel: string;
  items: Array<{ name: string; value: string }>;
  selectedItems: string[];
  setSelectedItems: any;
  iconStart?: JSX.Element;
  iconEnd?: JSX.Element;
  dropdownTitle?: string;
  buttonTailwindOveride?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  id,
  buttonLabel,
  items,
  selectedItems,
  setSelectedItems,
  iconStart = null,
  iconEnd = null,
  buttonTailwindOveride,
}) => {
  const [showItems, setShowItems] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowItems(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemChange = (e: any, value: string) => {
    if (selectedItems.find((letter) => letter === value)) {
      const newItems = selectedItems.filter((letter) => letter !== value);
      setSelectedItems(newItems);
    } else {
      const newItems = [...selectedItems, value];
      if (selectedItems.length >= 5) return;
      setSelectedItems(newItems);
    }
  };

  return (
    <div
      className="relative inline-block text-black text-left"
      ref={dropdownRef}
    >
      <button
        id={`${id}Button`}
        data-dropdown-toggle={`${id}Dropdown`}
        className={`flex items-center justify-center rounded-lg border h-8 border-gray-200 px-1 py-1 text-xs font-medium focus:z-10 focus:outline-none focus:ring-4 bg-gray-300 sm:px-4 sm:py-2 dark:bg-black dark:border dark:border-solid dark:border-gray-600 dark:text-white transition-transform transform hover:scale-105 hover:shadow-lg ${
          buttonTailwindOveride ? buttonTailwindOveride : "w-32"
        }`}
        type="button"
        onClick={() => setShowItems(!showItems)}
      >
        {iconStart && (
          <div className="ml-[-0.25rem] mr-1.5 w-5 text-skin-accent">
            {iconStart}
          </div>
        )}
        {buttonLabel}
        {iconEnd && (
          <div className="ml-1.5 mr-[-0.25rem] w-5 text-skin-accent">
            {iconEnd}
          </div>
        )}
      </button>
      {showItems && (
        <div
          id={`${id}Dropdown`}
          className="absolute right-0 top-full z-10 w-full shadow"
        >
          <ul
            className="custom-scrollbar max-h-44 overflow-y-auto bg-gray-300 text-sm text-black"
            aria-labelledby={`${id}Button`}
          >
            {items.map(({ name, value }, index) => (
              <li
                className={`block break-words border border-solid border-gray-200 py-2 text-center text-xs hover:bg-white/20 cursor-pointer dark:bg-black dark:border dark:border-solid dark:border-gray-400 dark:text-gray-400 ${
                  index === 0
                    ? "rounded-t-lg"
                    : index === items.length - 1
                    ? "rounded-b-lg"
                    : ""
                }`}
                key={value}
                onClick={(e) => handleItemChange(e, value)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
