/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
}) => {
  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = content;
    link.download = "palette.pdf";
    link.click();
    setIsDialogOpen(false);
  };

  const handleDownloadCSS = () => {
    const cssContent = `/* Generated with Palette Exporter\nhttps://palette.andresbr.com/\n\n${content}`;
    const blob = new Blob([cssContent], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "palette.css";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className="max-w-xs sm:max-w-md lg:max-w-2xl p-4">
        <DialogHeader>
          <DialogTitle>{`Export ${title}`}</DialogTitle>
          <DialogDescription>{`Preview and download the ${title} file. This will allow you to review the contents before saving it to your local system.`}</DialogDescription>
        </DialogHeader>
        {title === "Image" ? (
          <img
            src={content}
            alt="palette"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        ) : title === "PDF" ? (
          <>
            <iframe
              src={content}
              style={{ width: "100%", height: "60vh", border: "none" }}
              title="PDF Preview"
            ></iframe>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                handleDownloadPDF();
                setIsDialogOpen(false);
                toast.success("File downloaded successfully!", {
                  duration: 1500,
                });
              }}
              className="mt-4"
            >
              Download PDF
            </Button>
          </>
        ) : (
          <>
            <textarea
              readOnly
              value={content}
              className="w-full h-40 p-2 border rounded-md overflow-auto resize-none"
            />
            <div className="flex space-x-2 mt-4">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  handleDownloadCSS();
                  setIsDialogOpen(false);
                  toast.success("File downloaded successfully! ", {
                    duration: 1500,
                  });
                }}
                className="flex-1"
              >
                Download CSS
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  setIsDialogOpen(false);
                  toast.success("Text copied to clipboard!", {
                    duration: 1500,
                  });
                }}
                className="flex-1"
              >
                Copy to Clipboard
              </Button>
            </div>
          </>
        )}
        {title === "Image" && (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              const link = document.createElement("a");
              link.href = content;
              link.download = "palette.png";
              link.click();
              setIsDialogOpen(false);
              toast.success("Image downloaded successfully!", {
                duration: 1500,
              });
            }}
            className="mt-4"
          >
            Download Image
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
