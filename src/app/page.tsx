import React from "react";
import Navbar from "@/components/Navbar";
import Palette from "@/components/generator/Palette";

export default function Home() {
  return (
    <main className="h-full xl:overflow-y-hidden">
      <Navbar />
      <Palette />
      <footer className="block sm:hidden px-6 py-4">
        <p className="text-center text-neutral-800 dark:text-white">
          Made with ❤️ by <a href="https://www.andresbr.com/">Andres B.R</a>
        </p>
      </footer>
    </main>
  );
}
