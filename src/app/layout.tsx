import type { Metadata } from "next";
import { PaletteProvider } from "@/context/PaletteContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://palette.andresbr.com"),
  title: {
    default: "Palette",
    template: "%s | Palette",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: ["palette", "color", "design", "developer", "scheme"],
  description:
    "Discover and create beautiful color schemes for your projects. Perfect for designers and developers.",
  openGraph: {
    title: "Palette",
    description:
      "Discover and create beautiful color schemes for your projects. Perfect for designers and developers.",
    url: "https://palette.andresbr.com",
    type: "website",
    images: [
      {
        url: "./opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Palette",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@_andresbr",
    title: "Palette",
    description:
      "Discover and create beautiful color schemes for your projects. Perfect for designers and developers.",
    images: [
      {
        url: "https://palette.andresbr.com/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Palette",
      },
    ],
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
        className={`h-screen antialiased ${GeistSans.className} bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
