"use client";
import { useState } from "react";
import { BookOpen, MessageSquare, ShoppingCart, Settings } from "lucide-react";
import Link from "next/link";

const BottomNavbar = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { name: "read", icon: <BookOpen />, href: "/read" },
    { name: "speak", icon: <MessageSquare />, href: "/speak" },
    { name: "shop", icon: <ShoppingCart />, href: "/shop" },
    { name: "user", icon: <Settings />, href: "/user-profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-black shadow-md p-4 flex justify-around border-t dark:border-gray-500 md:hidden">
      {navItems.map((item) => (
        <Link key={item.name} href={item.href}>
          <div
            className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${
              active === item.name
                ? "text-green-500"
                : "text-black dark:text-white"
            }`}
            onClick={() => setActive(item.name)}
          >
            {item.icon}
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavbar;
