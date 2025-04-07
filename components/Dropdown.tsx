import React, { useState, useEffect, useRef } from "react";

interface DropdownProps {
  id: string;
  buttonLabel: string;
  items: Array<{ name: string; value: string }>;
  selectedItem: string | null;
  setSelectedItem: (value: string) => void;
  iconStart?: JSX.Element;
  iconEnd?: JSX.Element;
  buttonTailwindOverride?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  buttonLabel,
  items,
  selectedItem,
  setSelectedItem,
  iconStart = null,
  iconEnd = null,
  buttonTailwindOverride,
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

  const handleItemSelect = (value: string) => {
    setSelectedItem(value);
    setShowItems(false);
  };

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        id={`${id}Button`}
        data-dropdown-toggle={`${id}Dropdown`}
        className={`flex items-center justify-center  rounded-lg h-8 px-1 py-1 font-medium focus:z-10 focus:outline-none focus:ring-4 bg-gray-300 sm:px-4 sm:py-2 dark:bg-gray-800 dark:text-white ${
          buttonTailwindOverride ? buttonTailwindOverride : "w-full"
        }`}
        type="button"
        onClick={() => setShowItems(!showItems)}
      >
        {iconStart && (
          <div className="ml-[-0.25rem] mr-1.5 w-5">{iconStart}</div>
        )}
        {selectedItem ? (
          items.find((item) => item.value === selectedItem)?.name
        ) : (
          <span className="text-gray-500">{buttonLabel}</span>
        )}
        {iconEnd && <div className="ml-1.5 mr-[-0.25rem] w-5">{iconEnd}</div>}
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
                className={`block break-words dark:border dark:border-solid dark:border-gray-400 py-2 text-center  hover:bg-white/20 cursor-pointer dark:bg-gray-800 dark:text-white ${
                  index === 0
                    ? "rounded-t-lg"
                    : index === items.length - 1
                    ? "rounded-b-lg"
                    : ""
                } ${
                  selectedItem === value ? "bg-gray-400 dark:bg-gray-600" : ""
                }`}
                key={value}
                onClick={() => handleItemSelect(value)}
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

export default Dropdown;
