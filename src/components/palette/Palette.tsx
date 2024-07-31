"use client";

import React, { useEffect, useState } from "react";
import {
  DrawingPinIcon,
  DrawingPinFilledIcon,
  ReloadIcon,
  Cross1Icon,
  ShadowIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  hexToRgba,
  hexToHsl,
  hexToCmyk,
  hexToHsb,
  hexToRgb,
  getTextColor,
  findClosestColorName,
} from "@/utils/colorUtils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Header from "@/components/Header";
import { usePalette } from "@/context/PaletteContext";
import { toast } from "sonner";
import { PaintBucket } from "lucide-react";

const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full size-20 border-t-4 border-black dark:border-white"></div>
  </div>
);

function Palette() {
  const {
    isHovered,
    colorFormats,
    generateAndSaveNewPalette,
    colors,
    setColors,
    generateNewColor,
  } = usePalette();

  const [removingColorIndex, setRemovingColorIndex] = useState<number | null>(
    null
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(
    null
  );
  const [inputColor, setInputColor] = useState<string>("#ffffff");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (colors.length === 0) {
      generateAndSaveNewPalette();
    }
  }, [generateAndSaveNewPalette, colors.length]);

  useEffect(() => {
    if (selectedColorIndex !== null) {
      const selectedColor = colors[selectedColorIndex];
      setInputColor(selectedColor.hex);
    }
  }, [selectedColorIndex, colors]);

  const handlePinClick = (index: number) => {
    const newColors = colors.map((color, i) =>
      i === index ? { ...color, isPinned: !color.isPinned } : color
    );
    setColors(newColors);
    localStorage.setItem("palette", JSON.stringify(newColors));
  };

  const getTextColorClass = (hex: string) => {
    const textColor = getTextColor(hex);
    return textColor === "black" ? "text-black" : "text-white";
  };

  const handleClearColor = (index: number) => {
    setRemovingColorIndex(index);
    setTimeout(() => {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
      setRemovingColorIndex(null);
      if (newColors.length === 0) {
        generateAndSaveNewPalette();
      } else {
        localStorage.setItem("palette", JSON.stringify(newColors));
      }
    }, 300); // Duration of the animation
  };

  const getColorFormats = (hex: string) => {
    const formats: { [key: string]: string } = {
      HEX: hex,
      RGB: `rgb(${Object.values(hexToRgb(hex)).join(", ")})`,
      RGBA: hexToRgba(hex),
      HSL: hexToHsl(hex),
      HSB: hexToHsb(hex),
      CMYK: hexToCmyk(hex),
    };
    return colorFormats.map((format) => formats[format]);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setInputColor(newColor);

    if (selectedColorIndex !== null) {
      const newColors = colors.map((color, index) =>
        index === selectedColorIndex ? { ...color, hex: newColor } : color
      );
      setColors(newColors);
      localStorage.setItem("palette", JSON.stringify(newColors));
    }

    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer
    setDebounceTimer(
      setTimeout(() => {
        if (selectedColorIndex !== null) {
          const newColors = colors.map((color, index) =>
            index === selectedColorIndex
              ? { ...color, name: findClosestColorName(newColor) }
              : color
          );
          setColors(newColors);
          localStorage.setItem("palette", JSON.stringify(newColors));
        }
      }, 1000)
    );
  };

  if (colors.length === 0) {
    return <Spinner />;
  }

  return (
    <>
      <section className="flex flex-col xl:flex-row gap-5 h-[75%] xl:h-[80%] px-6">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`flex-1 h-full flex rounded-md flex-col justify-center items-center relative group ${
              removingColorIndex === index ? "slide-out flex-transition" : ""
            }`}
            style={{ backgroundColor: color.hex }}
          >
            <div className="absolute top-2 left-2 flex space-x-2 group">
              <Button
                variant="icon"
                size="icon"
                onClick={() => handlePinClick(index)}
                className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out ${
                  color.isPinned ? "opacity-100" : ""
                }`}
              >
                {color.isPinned ? (
                  <DrawingPinFilledIcon
                    className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(
                      color.hex
                    )}`}
                  />
                ) : (
                  <DrawingPinIcon
                    className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(
                      color.hex
                    )}`}
                  />
                )}
              </Button>
              <Button
                variant="icon"
                size="icon"
                className="group-hover:disabled:opacity-20 disabled:opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                onClick={() => {
                  if (!color.isPinned) {
                    const newColors = colors.map((c, i) =>
                      i === index
                        ? { ...generateNewColor(), isPinned: false }
                        : c
                    );
                    setColors(newColors);
                    localStorage.setItem("palette", JSON.stringify(newColors));
                  }
                }}
                disabled={color.isPinned}
              >
                <ReloadIcon
                  className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(
                    color.hex
                  )}`}
                />
              </Button>
              <Button
                variant="icon"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
              >
                <ShadowIcon
                  className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(
                    color.hex
                  )}`}
                />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="icon"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    onClick={() => setSelectedColorIndex(index)}
                  >
                    <PaintBucket
                      className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(
                        color.hex
                      )}`}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-fit p-5 mr-6">
                  <Header
                    title="Pick a color"
                    description="Pick a new color silly"
                  />
                  <input
                    type="color"
                    value={inputColor}
                    onChange={handleColorChange}
                    className="mt-4"
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="icon"
                size="icon"
                className="group-hover:disabled:opacity-20 disabled:opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                onClick={() => handleClearColor(index)}
                disabled={color.isPinned}
              >
                <Cross1Icon
                  className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(
                    color.hex
                  )}`}
                />
              </Button>
            </div>
            <h1
              className={`text-2xl text-center font-semibold select-none ${getTextColorClass(
                color.hex
              )}`}
            >
              {color.name}
            </h1>
            <div
              className={`flex flex-col items-center space-y-1 text-center px-2 rounded-md transition-all duration-300 ease-in-out ${
                isHovered
                  ? "border-2 border-red-500"
                  : "border-2 border-transparent"
              }`}
            >
              {getColorFormats(color.hex).map((format, i) => (
                <p
                  key={i}
                  onClick={() => {
                    navigator.clipboard.writeText(format);
                    toast.success("Text copied to clipboard!", {
                      duration: 1500,
                      description: `Copied format: ${format}`,
                    });
                  }}
                  className={`cursor-pointer text-lg uppercase select-none ${getTextColorClass(
                    color.hex
                  )}`}
                >
                  {format}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default Palette;
