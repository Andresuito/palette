import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <h1 className="mb-1 font-medium">Color Format</h1>
    <div className="grid grid-cols-2 gap-2 items-center">
      {ColorFormatOptions.map((format) => (
        <div key={format} className="flex items-center space-x-1">
          <Checkbox
            id={`${format}`}
            checked={colorFormats.includes(format)}
            onCheckedChange={() => handleCheckboxChange(format)}
            aria-labelledby={`label-${format}`}
          />
          <Label id={`label-${format}`} htmlFor={`${format}`}>
            {format}
          </Label>
        </div>
      ))}
    </div>
  </div>
);

export default ColorFormatSection;
