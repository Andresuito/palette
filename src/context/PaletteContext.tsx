"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { generateRandomColorFromList } from "@/utils/colorUtils";

type ColorType = {
  hex: string;
  name: string;
  isPinned: boolean;
};

type PaletteContextType = {
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
  colorFormats: string[];
  setColorFormats: React.Dispatch<React.SetStateAction<string[]>>;
  generateAndSaveNewPalette: () => void;
  colors: ColorType[];
  setColors: React.Dispatch<React.SetStateAction<ColorType[]>>;
  generateNewColor: () => ColorType;
  palette: string[];
};

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export const PaletteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [colorFormats, setColorFormats] = useState<string[]>(["HEX"]);
  const [colors, setColors] = useState<ColorType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedColorFormats = localStorage.getItem("colorFormats");
      const savedPalette = localStorage.getItem("palette");

      if (savedColorFormats) {
        setColorFormats(JSON.parse(savedColorFormats));
      }

      if (savedPalette) {
        setColors(JSON.parse(savedPalette));
      }

      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("colorFormats", JSON.stringify(colorFormats));
    }
  }, [colorFormats, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("palette", JSON.stringify(colors));
    }
  }, [colors, isLoaded]);

  const palette = colors.map((color) => color.hex);

  const generateAndSaveNewPalette = () => {
    if (!isLoaded) return;

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
        palette,
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
