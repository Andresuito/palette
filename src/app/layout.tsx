import type { Metadata } from "next";
import { PaletteProvider } from "@/context/PaletteContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeConfigProvider } from "@/context/ThemeConfig";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { toast } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Palette",
    template: "%s | Palette",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`h-screen antialiased ${GeistSans.className} theme-neutral`}
        style={{ "--radius": "0.5rem" } as React.CSSProperties}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeConfigProvider>
            <PaletteProvider>
              {children}{" "}
              <Toaster
                toastOptions={{
                  unstyled: false,
                  classNames: {
                    toast: "toaster-radius",
                  },
                }}
              />
            </PaletteProvider>
          </ThemeConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
