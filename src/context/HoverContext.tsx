"use client";

// context/HoverContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

type HoverContextType = {
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
  colorFormats: string[];
  setColorFormats: React.Dispatch<React.SetStateAction<string[]>>;
};

const HoverContext = createContext<HoverContextType | undefined>(undefined);

export const HoverProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [colorFormats, setColorFormats] = useState<string[]>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedColorFormats = localStorage.getItem("colorFormats");
      console.log("Loaded colorFormats from localStorage:", savedColorFormats);
      return savedColorFormats ? JSON.parse(savedColorFormats) : ["HEX"];
    }
    return ["HEX"];
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("colorFormats", JSON.stringify(colorFormats));
      console.log("Saved colorFormats to localStorage:", colorFormats);
    }
  }, [colorFormats]);

  return (
    <HoverContext.Provider
      value={{ isHovered, setIsHovered, colorFormats, setColorFormats }}
    >
      {children}
    </HoverContext.Provider>
  );
};

export const useHover = () => {
  const context = useContext(HoverContext);
  if (!context) {
    throw new Error("useHover must be used within a HoverProvider");
  }
  return context;
};
