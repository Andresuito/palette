/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Button } from "@/components/ui/button";
import { Share1Icon } from "@radix-ui/react-icons";
import { Image, FileText } from "lucide-react";
import Header from "@/components/Header";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ExportColors = ({
  handleExport,
}: {
  handleExport: (format: string) => void;
}) => (
  <div>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Export
          <Share1Icon className="ml-2 h-[1.1rem] w-[1.1rem] group-hover:scale-105 group-hover:rotate-12 duration-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="grid gap-4">
          <Header
            title="Export Palette"
            description="Select the desired format to export your palette. Multiple formats can be applied simultaneously."
          />
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport("CSS")}
            >
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
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport("IMAGE")}
            >
              <Image className="h-[1.3rem] w-[1.3rem] mr-1" />
              Image
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport("PDF")}
            >
              <FileText className="h-[1.3rem] w-[1.3rem] mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

export default ExportColors;
