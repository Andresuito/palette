/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useState, useRef } from "react";
import { Palette, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { usePalette } from "@/context/PaletteContext";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share1Icon } from "@radix-ui/react-icons";
import { Image } from "lucide-react";

const ColorFormatOptions = ["HEX", "HSL", "RGB", "RGBA", "CMYK", "HSB"];

function ConfigPallete() {
  const { setIsHovered, colorFormats, setColorFormats, palette } = usePalette();
  const [exportContent, setExportContent] = useState<string>("");
  const [exportTitle, setExportTitle] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCheckboxChange = (value: string) => {
    setColorFormats((prev: string[]) =>
      prev.includes(value)
        ? prev.filter((format) => format !== value)
        : [...prev, value]
    );
  };

  const handleExport = (format: string) => {
    if (format === "CSS") {
      setExportTitle(format);
      setExportContent(paletteToCSS(palette));
      setIsDialogOpen(true);
    } else if (format === "IMAGE") {
      const imageURL = generatePaletteImage(palette);
      setExportTitle("Image");
      setExportContent(imageURL);
      setIsDialogOpen(true);
    }
  };

  const generatePaletteImage = (colors: string[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const canvasWidth = 1920;
    const canvasHeight = 1080;
    const numColumns = Math.min(colors.length, Math.floor(canvasWidth / 300));
    const colorWidth = canvasWidth / numColumns;
    const colorHeight = canvasHeight - 100;
    const margin = 50;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    colors.forEach((color, index) => {
      const x = (index % numColumns) * colorWidth;
      const y = Math.floor(index / numColumns) * colorHeight;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, colorWidth, colorHeight);
    });

    ctx.fillStyle = "#000";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("palette", margin, canvasHeight - margin);

    return canvas.toDataURL();
  };

  return (
    <div className="flex space-x-3 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="default" className="group" size="sm">
            <Palette className="h-[1.1rem] w-[1.1rem] group-hover:scale-105 group-hover:rotate-12 duration-200" />
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
      <ExportColors handleExport={handleExport} />
      <ExportDialog
        isOpen={isDialogOpen}
        title={exportTitle}
        content={exportContent}
        setExportContent={setExportContent}
        setIsDialogOpen={setIsDialogOpen}
      />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

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

const ExportColors = ({
  handleExport,
}: {
  handleExport: (format: string) => void;
}) => (
  <div>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm">
          Export
          <Share1Icon className="ml-2 h-[1.1rem] w-[1.1rem] group-hover:scale-105 group-hover:rotate-12 duration-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="grid gap-4">
          <Header />
          <div className="grid grid-cols-2 gap-2">
            <Button disabled onClick={() => handleExport("CSS")}>
              <svg
                className="h-[1.3rem] w-[1.3rem] mr-1 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="m3 2 1.578 17.834L12 22l7.468-2.165L21 2H3Zm13.3 14.722-4.293 1.204H12l-4.297-1.204-.297-3.167h2.108l.15 1.526 2.335.639 2.34-.64.245-3.05h-7.27l-.187-2.006h7.64l.174-2.006H6.924l-.176-2.006h10.506l-.954 10.71Z" />
              </svg>
              CSS
            </Button>
            <Button onClick={() => handleExport("IMAGE")}>
              <Image className="h-[1.3rem] w-[1.3rem] mr-1" />
              Image
            </Button>
            <Button disabled>
              <FileText className="h-[1.3rem] w-[1.3rem] mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

const Header = () => (
  <div className="space-y-2">
    <h4 className="font-medium">Export</h4>
    <p className="text-sm text-muted-foreground">
      Export the palette as you like.
    </p>
  </div>
);

const ExportDialog = ({
  isOpen,
  title,
  content,
  setExportContent,
  setIsDialogOpen,
}: {
  isOpen: boolean;
  title: string;
  content: string;
  setExportContent: React.Dispatch<React.SetStateAction<string>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Dialog open={isOpen} onOpenChange={() => setIsDialogOpen(false)}>
    <DialogContent className="max-w-xs sm:max-w-md lg:max-w-2xl p-4">
      <DialogHeader>
        <DialogTitle>{`Export ${title}`}</DialogTitle>
        <DialogDescription>{`Download the ${title} when you click on the button.`}</DialogDescription>
      </DialogHeader>
      {title === "Image" ? (
        <img src={content} alt="palette" className="w-full h-auto" />
      ) : (
        <textarea
          readOnly
          value={content}
          className="w-full h-40 p-2 border rounded-md"
        />
      )}
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          if (title === "Image") {
            const link = document.createElement("a");
            link.href = content;
            link.download = "palette.png";
            link.click();
          } else {
            navigator.clipboard.writeText(content);
          }
          setIsDialogOpen(false);
        }}
        className="mt-4"
      >
        {title === "Image" ? "Download Image" : "Copy to Clipboard"}
      </Button>
    </DialogContent>
  </Dialog>
);

const paletteToCSS = (palette: any) => {
  return palette
    .map((color: string, index: number) => `--color-${index}: ${color};`)
    .join("\n");
};

export default ConfigPallete;
