"use client";

import React, { useState, useEffect } from "react";
import {
  CopyIcon,
  DrawingPinIcon,
  DrawingPinFilledIcon,
  ReloadIcon,
  Cross1Icon,
  ShadowIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  generateRandomColorFromList,
  hexToRgba,
  hexToHsl,
  hexToCmyk,
  getTextColor,
} from "@/utils/colorUtils";
import { useHover } from "@/context/HoverContext";
import { toast } from "sonner";

const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full size-20 border-t-4 border-black dark:border-white"></div>
  </div>
);

function Palette() {
  const [colors, setColors] = useState<
    { hex: string; name: string; isPinned: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { isHovered, colorFormats } = useHover();

  useEffect(() => {
    const savedPalette = localStorage.getItem("palette");
    if (savedPalette) {
      const parsedPalette = JSON.parse(savedPalette);
      if (parsedPalette.length === 0) {
        generateAndSaveNewPalette();
      } else {
        setColors(parsedPalette);
        setLoading(false);
      }
    } else {
      generateAndSaveNewPalette();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "n" || event.key === "N") {
        generateAndSaveNewPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (colors.length > 0) {
      localStorage.setItem("palette", JSON.stringify(colors));
    }
  }, [colors]);

  const generateAndSaveNewPalette = () => {
    const newPalette = Array.from({ length: 5 }, () => ({
      ...generateRandomColorFromList(),
      isPinned: false,
    }));
    setColors(newPalette);
    localStorage.setItem("palette", JSON.stringify(newPalette));
    setLoading(false);
  };

  const handleGenerateColor = () => {
    generateAndSaveNewPalette();
  };

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
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
    if (newColors.length === 0) {
      generateAndSaveNewPalette();
    } else {
      localStorage.setItem("palette", JSON.stringify(newColors));
    }
  };

  const getColorFormats = (hex: string) => {
    const formats: { [key: string]: string } = {
      HEX: hex,
      RGB: hexToRgba(hex),
      HLS: hexToHsl(hex),
      CMYK: hexToCmyk(hex),
    };
    return colorFormats.map((format) => formats[format]);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="grid grid-cols-1 gap-5 h-full xl:flex px-6">
        {colors.map((color, index) => {
          return (
            <div
              key={index}
              className={`flex-1 xl:h-3/5 flex rounded-md flex-col justify-center items-center relative group`}
              style={{ backgroundColor: color.hex }}
            >
              <div className="absolute top-2 left-2 flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="icon"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(color.hex);
                      }}
                    >
                      <CopyIcon
                        className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(
                          color.hex
                        )}`}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>{color.hex}</DropdownMenuItem>
                    <DropdownMenuItem>{hexToRgba(color.hex)}</DropdownMenuItem>
                    <DropdownMenuItem>{hexToHsl(color.hex)}</DropdownMenuItem>
                    <DropdownMenuItem>{hexToCmyk(color.hex)}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="icon"
                  size="icon"
                  onClick={() => handlePinClick(index)}
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
                  onClick={() => {
                    if (!color.isPinned) {
                      const newColors = [...colors];
                      newColors[index] = {
                        ...generateRandomColorFromList(),
                        isPinned: false,
                      };
                      setColors(newColors);
                      localStorage.setItem(
                        "palette",
                        JSON.stringify(newColors)
                      );
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
                <Button disabled variant="icon" size="icon">
                  <ShadowIcon
                    className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(
                      color.hex
                    )}`}
                  />
                </Button>
                <Button
                  variant="icon"
                  size="icon"
                  onClick={() => handleClearColor(index)}
                >
                  <Cross1Icon
                    className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(
                      color.hex
                    )}`}
                  />
                </Button>
              </div>
              <h1
                className={`text-2xl text-center font-semibold poin select-none ${getTextColorClass(
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
                    className={`cursor-pointer text-lg uppercase font-semibold select-none ${getTextColorClass(
                      color.hex
                    )}`}
                  >
                    {format}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}

export default Palette;
