"use client";

import { useState, useEffect, useRef } from "react";
import { LivesCounter } from "./LivesCounter";
import { StreakCounter } from "./StreakCounter";
import { RefillCounter } from "./RefillCounter";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";
import SignupButton from "./SignupButton";

interface TopNavBarProps {
  loggedOut?: boolean;
  isPremium?: boolean;
  showValues?: boolean;
}

const Navbar: React.FC<TopNavBarProps> = ({
  loggedOut,
  isPremium,
  showValues = true,
}) => {
  const [isToggled, setIsToggled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Optional: close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsToggled(false);
      }
    };

    if (isToggled) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggled]);

  return (
    <header className="sticky top-0 z-20 h-[10vh]">
      <div className="w-screen h-full relative flex justify-between items-center p-4 bg-white shadow-md dark:bg-black dark:border-b dark:border-solid dark:border-gray-500">
        <div className="flex items-center space-x-4">
          {showValues && (
            <>
              <LivesCounter loggedOut={loggedOut} />
              <StreakCounter loggedOut={loggedOut} />
              <RefillCounter loggedOut={loggedOut} isPremium={isPremium} />
            </>
          )}
        </div>
        {/* Container for the theme and logout buttons */}
        <div className="relative">
          {/* Inline display on md and larger screens */}
          <div className="hidden sm:flex justify-between w-60">
            <ThemeToggle />
            <LogoutButton loggedIn={!loggedOut} />
            <SignupButton />
          </div>

          {/* Hamburger menu on small screens */}
          <div className="sm:hidden" ref={menuRef}>
            <button
              onClick={() => setIsToggled(!isToggled)}
              className="p-2 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isToggled}
            >
              {/* Hamburger Icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {isToggled && (
              <div className="h-40 p-6 flex flex-col absolute right-0 mt-2 w-40 bg-white dark:bg-black shadow-md rounded">
                <ThemeToggle />
                <LogoutButton loggedIn={!loggedOut} />
                <SignupButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
