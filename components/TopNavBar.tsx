"use client";

import { Heart, Crown } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-[10vh]">
      <div className="w-screen h-full relative flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Heart className="text-red-500" size={24} />
            <span className="ml-1 font-bold text-lg">5</span>
          </div>
          <div className="flex items-center">
            <Crown className="text-yellow-500" size={24} />
            <span className="ml-1 font-bold text-lg">5</span>
          </div>
        </div>
        <button
          className="relative w-10 h-6 flex items-center bg-gray-200 rounded-full p-1"
          onClick={() => setIsToggled(!isToggled)}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
              isToggled ? "translate-x-4" : "translate-x-0"
            }`}
          ></div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
