"use client";

import React from "react";
import { Palette } from "lucide-react";
import { Button } from "../ui/button";
import { usePalette } from "@/context/PaletteContext";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ColorFormatOptions = ["HEX", "HSL", "RGB", "RGBA", "CMYK", "HSB"];

function ConfigPallete() {
  const { setIsHovered, colorFormats, setColorFormats } = usePalette();

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
            <Palette className="h-[1.2rem] w-[1.2rem] group-hover:scale-105 group-hover:rotate-12 duration-200" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-6">
          <div className="grid gap-4">
            <Header />
            <ColorFormatSection
              colorFormats={colorFormats}
              handleCheckboxChange={handleCheckboxChange}
              setIsHovered={setIsHovered}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const Header = () => (
  <div className="space-y-2">
    <h4 className="font-medium">Palette Settings</h4>
    <p className="text-sm text-muted-foreground">
      Configure the palette settings to your liking.
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

export default ConfigPallete;
