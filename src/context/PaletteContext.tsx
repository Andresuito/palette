"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { generateRandomColorFromList } from "@/utils/colorUtils";

type PaletteContextType = {
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
  colorFormats: string[];
  setColorFormats: React.Dispatch<React.SetStateAction<string[]>>;
  generateAndSaveNewPalette: () => void;
  colors: { hex: string; name: string; isPinned: boolean }[];
  setColors: React.Dispatch<
    React.SetStateAction<{ hex: string; name: string; isPinned: boolean }[]>
  >;
  generateNewColor: () => { hex: string; name: string; isPinned: boolean };
};

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export const PaletteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [colorFormats, setColorFormats] = useState<string[]>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedColorFormats = localStorage.getItem("colorFormats");
      return savedColorFormats ? JSON.parse(savedColorFormats) : ["HEX"];
    }
    return ["HEX"];
  });
  const [colors, setColors] = useState<
    { hex: string; name: string; isPinned: boolean }[]
  >(() => {
    const savedPalette = localStorage.getItem("palette");
    return savedPalette ? JSON.parse(savedPalette) : [];
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("colorFormats", JSON.stringify(colorFormats));
    }
  }, [colorFormats]);

  const generateAndSaveNewPalette = () => {
    const updatedPalette = colors.map((color) =>
      color.isPinned
        ? color
        : { ...generateRandomColorFromList(), isPinned: false }
    );

    while (updatedPalette.length < 5) {
      updatedPalette.push({
        ...generateRandomColorFromList(),
        isPinned: false,
      });
    }

    setColors(updatedPalette);
    localStorage.setItem("palette", JSON.stringify(updatedPalette));
  };

  const generateNewColor = () => {
    return { ...generateRandomColorFromList(), isPinned: false };
  };

  return (
    <PaletteContext.Provider
      value={{
        isHovered,
        setIsHovered,
        colorFormats,
        setColorFormats,
        generateAndSaveNewPalette,
        generateNewColor,
        colors,
        setColors,
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
};

export const usePalette = () => {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return context;
};
