import React from "react";
import Navbar from "@/components/Navbar";
import ConfigPallete from "@/components/palette/ConfigPalette/ConfigPalette";
import Palette from "@/components/palette/Palette";
import GenerateNewPalette from "@/components/palette/GenerateNewPalette";

export default function Home() {
  return (
    <main className="h-full xl:overflow-y-hidden">
      <Navbar />
      <section className="flex justify-between py-5 px-6">
        <GenerateNewPalette />
        <div className="flex space-x-3 items-center">
          <ConfigPallete />
        </div>
      </section>
      <Palette />
      <footer className="block xl:hidden px-6 py-4">
        <p className="text-start text-neutral-800 dark:text-white">
          Made by{" "}
          <a target="_blank" href="https://www.andresbr.com/">
            Andres B.R
          </a>
        </p>
      </footer>
    </main>
  );
}
