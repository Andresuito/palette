/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

export default ExportDialog;
