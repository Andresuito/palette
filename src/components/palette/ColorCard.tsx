import React, { useState, useEffect, useCallback } from "react";
import {
  DrawingPinIcon,
  DrawingPinFilledIcon,
  ReloadIcon,
  Cross1Icon,
  ShadowIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
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
  generateShades,
} from "@/utils/colorUtils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { PaintBucket } from "lucide-react";
import { toast } from "sonner";

interface ColorCardProps {
  color: any;
  index: number;
}

const ColorCard = ({ color, index }: ColorCardProps) => {
  const {
    isHovered,
    colorFormats,
    colors,
    setColors,
    generateNewColor,
    generateAndSaveNewPalette,
  } = usePalette();

  const [showShades, setShowShades] = useState(false);
  const [removingColorIndex, setRemovingColorIndex] = useState<number | null>(
    null
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(
    null
  );
  const [inputColor, setInputColor] = useState<string>(color.hex);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const format = colorFormats.length;

  useEffect(() => {
    if (selectedColorIndex === index) {
      setInputColor(color.hex);
    }
  }, [color.hex, selectedColorIndex, index]);

  const updateColors = useCallback(
    (newColors: any[]) => {
      setColors(newColors);
      localStorage.setItem("palette", JSON.stringify(newColors));
    },
    [setColors]
  );

  const handlePinClick = () => {
    const newColors = colors.map((c, i) =>
      i === index ? { ...c, isPinned: !c.isPinned } : c
    );
    updateColors(newColors);
  };

  const handleClearColor = () => {
    setRemovingColorIndex(index);
    setTimeout(() => {
      const newColors = colors.filter((_, i) => i !== index);
      updateColors(newColors);
      setRemovingColorIndex(null);
      if (newColors.length === 0) {
        generateAndSaveNewPalette();
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
            const newColors = colors.map((c, i) =>
              i === selectedColorIndex
                ? { ...c, hex: newColor, name: findClosestColorName(newColor) }
                : c
            );
            updateColors(newColors);
          }
        }
      }, 500)
    );
  };

  const getTextColorClass = (hex: string) => {
    return getTextColor(hex) === "black" ? "text-black" : "text-white";
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
    return colorFormats
      .filter((format) => formats[format])
      .map((format) => formats[format]);
  };

  const handleClipboardCopy = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!", {
      duration: 1500,
      description,
    });
  };

  const renderIconButton = (
    Icon: React.ComponentType<any>,
    onClick: () => void,
    disabled = false
  ) => (
    <Button
      variant="icon"
      size="icon"
      className={`lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out ${
        color.isPinned ? "opacity-100" : ""
      } ${
        disabled ? "group-hover:disabled:opacity-20 lg:disabled:opacity-0" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon
        className={`h-[1.0rem] w-[1.0rem] ${getTextColorClass(color.hex)}`}
      />
    </Button>
  );

  return (
    <div
      className={`flex-1 h-full flex rounded-md flex-col justify-center items-center relative group ${
        removingColorIndex === index ? "slide-out flex-transition" : ""
      }`}
      style={{ backgroundColor: color.hex }}
    >
      <div className="absolute top-2 left-2 flex space-x-2 group">
        {renderIconButton(
          color.isPinned ? DrawingPinFilledIcon : DrawingPinIcon,
          handlePinClick
        )}
        {renderIconButton(
          ReloadIcon,
          () => {
            if (!color.isPinned) {
              const newColors = colors.map((c, i) =>
                i === index ? { ...generateNewColor(), isPinned: false } : c
              );
              updateColors(newColors);
            }
          },
          color.isPinned
        )}
        {format >= 1 && (
          <>
            {renderIconButton(ShadowIcon, () => setShowShades((prev) => !prev))}
            <Popover>
              <PopoverTrigger asChild>
                {renderIconButton(PaintBucket, () =>
                  setSelectedColorIndex(index)
                )}
              </PopoverTrigger>
              <PopoverContent align="center" className="w-fit p-4">
                <HexColorPicker
                  color={inputColor}
                  onChange={handleColorChange}
                />
                <div className="relative">
                  <Input
                    value={inputColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="mt-4 relative"
                  />
                  <div
                    className="top-1.5 right-2 absolute size-5 rounded-full"
                    style={{ backgroundColor: inputColor }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
        {renderIconButton(Cross1Icon, handleClearColor, color.isPinned)}
      </div>
      <div className="flex-row py-10 xl:py-0">
        <h1
          className={`text-2xl text-center font-semibold select-none ${getTextColorClass(
            color.hex
          )}`}
        >
          {color.name}
        </h1>
        <div
          className={`flex flex-col items-center space-y-1 mx-auto justify-center text-center px-2 rounded-md duration-300 ease-in-out ${
            isHovered && format >= 1
              ? "border-2 border-red-500/70"
              : "border-2 border-transparent"
          }`}
        >
          {getColorFormats(color.hex).map((format, i) => (
            <p
              key={i}
              onClick={() =>
                handleClipboardCopy(format, `Copied format: ${format}`)
              }
              className={`cursor-pointer text-lg uppercase select-none ${getTextColorClass(
                color.hex
              )}`}
            >
              {format}
            </p>
          ))}
        </div>
      </div>
      {format >= 1 && (
        <div
          className={`flex flex-col w-fit justify-center transition-all duration-500 ease-in-out overflow-hidden rounded-xl lg:mt-5 ${
            showShades
              ? "max-h-[700px] opacity-100 mb-10 xl:mb-0"
              : "max-h-0 opacity-0"
          }`}
        >
          {generateShades(color.hex).map((shade, i) => {
            const shadeFormats = getColorFormats(shade);
            return (
              <div
                key={i}
                className="px-10 py-1 flex items-center justify-center cursor-pointer select-none"
                style={{ backgroundColor: shade }}
                onClick={() =>
                  handleClipboardCopy(
                    shadeFormats[0],
                    `Copied shade: ${shadeFormats[0]}`
                  )
                }
              >
                <span className={`text-sm ${getTextColorClass(shade)}`}>
                  {shadeFormats[0]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ColorCard;
