"use client";

import { createContext, useState, useContext } from "react";

// Define the context type
type SharedStateContextType = {
  sharedState: any;
  setSharedState: (value: any) => void;
};

const SharedStateContext = createContext<SharedStateContextType | undefined>(
  undefined
);

export const SharedStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sharedState, setSharedState] = useState("default value");

  return (
    <SharedStateContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }
  return context;
};
