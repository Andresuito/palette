import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

const ColorFormatOptions = ["HEX", "HSL", "RGB", "RGBA", "CMYK", "HSB"];

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

export default ColorFormatSection;
