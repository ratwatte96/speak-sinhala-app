"use client";
import { createContext, useState, useContext, ReactNode } from "react";

// Define XP state type
type XPState = {
  dailyXP: number;
  totalXP: number;
};

// Define the shape of the shared state
type SharedStateType = {
  lives: number;
  refills: number;
  xp: XPState;
};

type SharedStateValue = number | XPState;

type SharedStateContextType = {
  sharedState: SharedStateType;
  setSharedState: (key: keyof SharedStateType, value: SharedStateValue) => void;
};

const SharedStateContext = createContext<SharedStateContextType | undefined>(
  undefined
);

export const SharedStateProvider = ({ children }: { children: ReactNode }) => {
  const [sharedState, setSharedStateInternal] = useState<SharedStateType>({
    lives: 0,
    refills: 0,
    xp: {
      dailyXP: 0,
      totalXP: 0,
    },
  });

  // Function to update only one property of the state
  const setSharedState = (
    key: keyof SharedStateType,
    value: SharedStateValue
  ) => {
    setSharedStateInternal((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

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
