"use client";

import { useState } from "react";
import { LivesCounter } from "./LivesCounter";
import { StreakCounter } from "./StreakCounter";
import { RefillCounter } from "./RefillCounter";
import ThemeToggle from "./ThemeToggle";

interface TopNavBarProps {
  loggedOut?: boolean;
  isPremium?: boolean;
}

const Navbar: React.FC<TopNavBarProps> = ({ loggedOut, isPremium }) => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-[10vh]">
      <div className="w-screen h-full relative flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <LivesCounter loggedOut={loggedOut} />
          </div>
          <div className="flex items-center">
            <StreakCounter loggedOut={loggedOut} />
          </div>
          <div className="flex items-center">
            <RefillCounter loggedOut={loggedOut} isPremium={isPremium} />
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
