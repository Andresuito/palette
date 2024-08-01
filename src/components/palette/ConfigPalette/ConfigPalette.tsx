"use client";

import React, { useState, useRef } from "react";
import { Palette, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePalette } from "@/context/PaletteContext";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import ColorFormatSection from "./ColorFormatSection";
import ExportColors from "./ExportColors";
import ExportDialog from "./ExportDialog";
import Header from "@/components/Header";
import { generatePaletteImage } from "@/utils/canvaGenerator";
import { paletteToCSS } from "@/utils/formatCSS";
import { generatePalettePDF } from "@/utils/pdfGenerator";

function ConfigPalette() {
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

  const handleExport = async (format: string) => {
    if (format === "CSS") {
      setExportTitle("CSS");
      setExportContent(paletteToCSS(palette));
      setIsDialogOpen(true);
    } else if (format === "IMAGE") {
      const imageURL = generatePaletteImage(palette, canvasRef.current);
      setExportTitle("Image");
      setExportContent(imageURL);
      setIsDialogOpen(true);
    } else if (format === "PDF") {
      setExportTitle("PDF");
      const pdfData = await generatePalettePDF(palette);
      const pdfBlob = new Blob([pdfData], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setExportContent(pdfUrl);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="flex space-x-3 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="group" size="sm">
            <Palette className="h-[1.1rem] w-[1.1rem] group-hover:scale-105 group-hover:rotate-12 duration-200" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-6">
          <div className="grid gap-4">
            <Header
              title="Palette Configurator"
              description="Change the format in which you want to view the color. You can apply multiple formats simultaneously."
            />
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

export default ConfigPalette;
