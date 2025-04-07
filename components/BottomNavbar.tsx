"use client";
import { useState } from "react";
import {
  BookOpen,
  MessageSquare,
  ShoppingCart,
  Settings,
  LoaderCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const BottomNavbar = () => {
  const pathname = usePathname();
  const currentPage = pathname.split("/").pop();
  const navItems = [
    { name: "Read", icon: <BookOpen />, href: "/read" },
    { name: "Speak", icon: <MessageSquare />, href: "/speak" },
    { name: "Shop", icon: <ShoppingCart />, href: "/shop" },
    { name: "Profile", icon: <Settings />, href: "/profile" },
  ];

  const [active, setActive] = useState(
    navItems.find((item: any) => item.href === `/${currentPage}`)?.name
  );
  const [isLoading, setIsLoading] = useState(false);

  return (
    <nav className="z-20 fixed bottom-0 left-0 w-full bg-white dark:bg-black shadow-md px-4 flex justify-around border-t dark:border-gray-500 md:hidden">
      {navItems.map((item) => (
        <Link key={item.name} href={item.href}>
          {isLoading && active === item.name ? (
            <div className="w-[25vw] flex items-center justify-center h-full">
              <LoaderCircle className="text-green-500 w-full animate-spin" />
            </div>
          ) : (
            <div
              className={`flex-col-center cursor-pointer transition-colors duration-200 w-[25vw] pt-4 pb-3 ${
                active === item.name
                  ? "text-green-500"
                  : "text-black dark:text-white"
              }`}
              onClick={() => {
                setActive(item.name);
                if (active !== item.name) setIsLoading(true);
              }}
            >
              {item.icon}
              <p className="text-xs">{item.name}</p>
            </div>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavbar;
