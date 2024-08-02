"use client";
import { useEffect } from "react";

export type ToastType = "Correct" | "Incorrect" | "";

interface ToastProps {
  message: string;
  onClose: () => void;
  toastType: ToastType;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, toastType }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${
        toastType === "Correct"
          ? "bg-green-800"
          : toastType === "Incorrect"
          ? "bg-red-800"
          : "bg-grey-800"
      } fixed bottom-5 left-1/2 z-50 -translate-x-1/2 transform rounded  px-4 py-2 text-white shadow-lg`}
    >
      {message}
      <button onClick={onClose} className="ml-4 text-white">
        X
      </button>
    </div>
  );
};

export default Toast;
