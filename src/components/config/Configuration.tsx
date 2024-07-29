"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GearIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useHover } from "@/context/HoverContext";
import { useTheme } from "@/context/ThemeConfig";

const ColorFormatOptions = ["HEX", "HLS", "RGB", "CMYK"];
const ColorOptions = [
  "theme-zinc",
  "theme-slate",
  "theme-stone",
  "theme-gray",
  "theme-neutral",
  "theme-red",
  "theme-rose",
  "theme-orange",
  "theme-green",
  "theme-blue",
  "theme-yellow",
  "theme-violet",
];

const Configuration = () => {
  const { setIsHovered, colorFormats, setColorFormats } = useHover();
  const { config, setConfig } = useTheme();
  const { color, radius } = config;

  const handleCheckboxChange = (value: string) => {
    setColorFormats((prev: string[]) =>
      prev.includes(value)
        ? prev.filter((format) => format !== value)
        : [...prev, value]
    );
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="group" size="icon">
            <GearIcon className="h-[1.2rem] w-[1.2rem] group-hover:scale-105 group-hover:rotate-12 duration-200" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-2">
          <div className="grid gap-4">
            <Header />
            <ColorFormatSection
              colorFormats={colorFormats}
              handleCheckboxChange={handleCheckboxChange}
              setIsHovered={setIsHovered}
            />
            <BorderRadiusSection
              borderRadius={radius}
              setBorderRadius={(newRadius: string) =>
                setConfig({ color, radius: newRadius })
              }
            />
            <ColorSelector
              color={color}
              setColor={(newColor: string) =>
                setConfig({ color: newColor, radius })
              }
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const Header = () => (
  <div className="space-y-2">
    <h4 className="font-medium">Configuration</h4>
    <p className="text-sm text-muted-foreground">
      Configure the website as you like
    </p>
  </div>
);

const ColorFormatSection = ({
  colorFormats,
  handleCheckboxChange,
  setIsHovered,
}: {
  colorFormats: string[];
  handleCheckboxChange: (value: string) => void;
  setIsHovered: (isHovered: boolean) => void;
}) => (
  <div
    className="grid gap-2"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <div className="text-sm">
      <h1 className="mb-2 font-medium">Color Format</h1>
      <div className="grid grid-cols-2 items-center">
        {ColorFormatOptions.map((format) => (
          <div key={format} className="space-x-1 flex items-center">
            <Checkbox
              id={`colorFormat${format}`}
              checked={colorFormats.includes(format)}
              onCheckedChange={() => handleCheckboxChange(format)}
            />
            <label htmlFor={`colorFormat${format}`}>{format}</label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BorderRadiusSection = ({
  borderRadius,
  setBorderRadius,
}: {
  borderRadius: string;
  setBorderRadius: (radius: string) => void;
}) => (
  <div className="text-sm">
    <h1 className="font-medium mb-2">Border Radius</h1>
    <div className="flex justify-between">
      {["0", "0.3", "0.5", "0.75", "1.0"].map((radius) => (
        <Button
          key={radius}
          size="sm"
          variant="outline"
          onClick={() => setBorderRadius(radius)}
          className={borderRadius === radius ? "ring-2 ring-ring" : ""}
        >
          {radius}
        </Button>
      ))}
    </div>
  </div>
);

const ColorSelector = ({
  color,
  setColor,
}: {
  color: string;
  setColor: (color: string) => void;
}) => {
  const colorMap: { [key: string]: string } = {
    "theme-zinc": "bg-zinc-500",
    "theme-slate": "bg-slate-500",
    "theme-stone": "bg-stone-500",
    "theme-gray": "bg-gray-500",
    "theme-neutral": "bg-neutral-500",
    "theme-red": "bg-red-500",
    "theme-rose": "bg-rose-500",
    "theme-orange": "bg-orange-500",
    "theme-green": "bg-green-500",
    "theme-blue": "bg-blue-500",
    "theme-yellow": "bg-yellow-500",
    "theme-violet": "bg-violet-500",
  };

  return (
    <div className="text-sm">
      <h1 className="font-medium mb-2">Color Scheme</h1>
      <div className="grid grid-cols-3 gap-2">
        {ColorOptions.map((colorOption) => (
          <Button
            key={colorOption}
            size="sm"
            variant="outline"
            onClick={() => setColor(colorOption)}
            className={`flex items-center justify-start ${
              color === colorOption ? "ring-2 ring-ring" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${colorMap[colorOption]}`}
              ></div>
              <p className="font-medium">
                {colorOption.replace("theme-", "").charAt(0).toUpperCase() +
                  colorOption.replace("theme-", "").slice(1)}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Configuration;
