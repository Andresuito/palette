"use client";

import React, { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "../ui/button";
import { usePalette } from "@/context/PaletteContext";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share1Icon } from "@radix-ui/react-icons";

const ColorFormatOptions = ["HEX", "HSL", "RGB", "RGBA", "CMYK", "HSB"];

function ConfigPallete() {
  const { setIsHovered, colorFormats, setColorFormats, palette } = usePalette();
  const [exportContent, setExportContent] = useState<string>("");
  const [exportTitle, setExportTitle] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleCheckboxChange = (value: string) => {
    setColorFormats((prev: string[]) =>
      prev.includes(value)
        ? prev.filter((format) => format !== value)
        : [...prev, value]
    );
  };

  const handleExport = (format: string) => {
    let content = "";
    if (format === "CSS") {
      content = paletteToCSS(palette);
    } else if (format === "JSON") {
      content = JSON.stringify(palette, null, 2);
    }
    setExportTitle(format);
    setExportContent(content);
    setIsDialogOpen(true);
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

const ExportColors = ({
  handleExport,
}: {
  handleExport: (format: string) => void;
}) => (
  <div>
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Export{" "}
          <Share1Icon className="ml-2 h-[1.1rem] w-[1.1rem] group-hover:scale-105 group-hover:rotate-12 duration-200" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Colors</DialogTitle>
          <DialogDescription>
            Export your palette of colors in the following formats.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleExport("CSS")}
          >
            CSS
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleExport("JSON")}
          >
            JSON
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{`Export ${title}`}</DialogTitle>
        <DialogDescription>{`Copy the ${title} content below.`}</DialogDescription>
      </DialogHeader>
      <textarea
        readOnly
        value={content}
        className="w-full h-40 p-2 border rounded-md"
      />
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(content);
          setIsDialogOpen(false);
        }}
      >
        Copy to Clipboard
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
