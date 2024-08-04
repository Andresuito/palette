import React, { useState } from "react";
import {
  DrawingPinIcon,
  DrawingPinFilledIcon,
  ReloadIcon,
  Cross1Icon,
  ShadowIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { Input } from "../ui/input";
import { usePalette } from "@/context/PaletteContext";
import {
  getTextColor,
  findClosestColorName,
  isValidHex,
  isPartialHex,
  hexToRgb,
  hexToRgba,
  hexToHsl,
  hexToCmyk,
  hexToHsb,
} from "@/utils/colorUtils";
import { PaintBucket } from "lucide-react";
import { toast } from "sonner";

interface ColorCardProps {
  color: any;
  index: number;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, index }) => {
  const {
    isHovered,
    colorFormats,
    colors,
    setColors,
    generateNewColor,
    generateAndSaveNewPalette,
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

  const handlePinClick = (index: number) => {
    const newColors = colors.map((color, i) =>
      i === index ? { ...color, isPinned: !color.isPinned } : color
    );
    setColors(newColors);
    localStorage.setItem("palette", JSON.stringify(newColors));
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
    }, 300);
  };

  const handleColorChange = (newColor: string) => {
    if (isPartialHex(newColor)) {
      setInputColor(newColor);
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    setDebounceTimer(
      setTimeout(() => {
        if (isValidHex(newColor)) {
          setInputColor(newColor);

          if (selectedColorIndex !== null) {
            const newColors = colors.map((color, index) =>
              index === selectedColorIndex
                ? {
                    ...color,
                    hex: newColor,
                    name: findClosestColorName(newColor),
                  }
                : color
            );
            setColors(newColors);
            localStorage.setItem("palette", JSON.stringify(newColors));
          }
        }
      }, 500)
    );
  };

  const getTextColorClass = (hex: string) => {
    const textColor = getTextColor(hex);
    return textColor === "black" ? "text-black" : "text-white";
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

  return (
    <div
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
                i === index ? { ...generateNewColor(), isPinned: false } : c
              );
              setColors(newColors);
              localStorage.setItem("palette", JSON.stringify(newColors));
            }
          }}
          disabled={color.isPinned}
        >
          <ReloadIcon
            className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(color.hex)}`}
          />
        </Button>
        <Button
          variant="icon"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
        >
          <ShadowIcon
            className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(color.hex)}`}
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
          <PopoverContent align="center" className="w-fit p-4">
            <HexColorPicker color={inputColor} onChange={handleColorChange} />
            <div className="relative">
              <Input
                value={inputColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="mt-4 relative"
              />
              <div
                className="top-1.5 right-2 absolute size-5 rounded-full"
                style={{ backgroundColor: inputColor }}
              ></div>
            </div>
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
            className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(color.hex)}`}
          />
        </Button>
      </div>
      <div className="flex sm:flex-col">
        <h1
          className={`text-2xl text-center font-semibold select-none ${getTextColorClass(
            color.hex
          )}`}
        >
          {color.name}
        </h1>
        <div
          className={`flex flex-col items-center space-y-1 mx-auto justify-center text-center px-2 rounded-md transition-all duration-300 ease-in-out ${
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
    </div>
  );
};

export default ColorCard;