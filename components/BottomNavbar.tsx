"use client";
import { useState } from "react";
import { BookOpen, MessageSquare, ShoppingCart, Settings } from "lucide-react";
import Link from "next/link";

const BottomNavbar = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { name: "home", icon: <BookOpen />, href: "/" },
    { name: "messages", icon: <MessageSquare />, href: "/messages" },
    { name: "cart", icon: <ShoppingCart />, href: "/cart" },
    { name: "settings", icon: <Settings />, href: "/settings" },
  ];

  return (
    <nav className="relative bottom-0 w-screen h-[10vh] bg-white shadow-md p-4 flex justify-around border-t md:hidden">
      {navItems.map((item) => (
        <Link key={item.name} href={item.href}>
          <div
            className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${
              active === item.name ? "text-green-500" : "text-black"
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
