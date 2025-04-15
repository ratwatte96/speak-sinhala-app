"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";

interface HeartRewardToastProps {
  message: string;
  hearts: number;
  onClose: () => void;
}

const HeartRewardToast: React.FC<HeartRewardToastProps> = ({
  message,
  hearts,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 transform">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center space-x-3 animate-fadeIn">
        <div className="flex items-center">
          {[...Array(hearts)].map((_, i) => (
            <Heart
              key={i}
              className="w-5 h-5 text-red-500 animate-bounce"
              style={{
                animationDelay: `${i * 200}ms`,
                animationDuration: "1s",
              }}
              fill="currentColor"
            />
          ))}
        </div>
        <p className="text-gray-800 dark:text-white font-medium">{message}</p>
      </div>
    </div>
  );
};

export default HeartRewardToast;
