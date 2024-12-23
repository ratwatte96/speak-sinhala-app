/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/consistent-type-imports */
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
  dropdownTitle,
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
      className="relative inline-block bg-skin-muted text-left"
      ref={dropdownRef}
    >
      <button
        id={`${id}Button`}
        data-dropdown-toggle={`${id}Dropdown`}
        className={`flex items-center justify-center rounded-lg border border-skin-base px-2 py-1 text-xs font-medium text-skin-base focus:z-10 focus:outline-none focus:ring-4  sm:px-4 sm:py-2 sm:text-sm ${
          buttonTailwindOveride ? buttonTailwindOveride : "w-24 sm:w-40"
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
            className="custom-scrollbar max-h-44 overflow-y-auto bg-skin-muted text-sm text-skin-base"
            aria-labelledby={`${id}Button`}
          >
            {items.map(({ name, value }, index) => (
              <li
                className={`block break-words border border-solid border-skin-base py-2 text-center text-xs hover:bg-white/20 cursor-pointer ${
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
