import React from "react";
import ConfigPallete from "@/components/palette/ConfigPalette/ConfigPalette";
import Palette from "@/components/palette/Palette";
import GenerateNewPalette from "@/components/palette/GenerateNewPalette";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="h-full">
      <section className="flex justify-between py-5 px-6">
        <GenerateNewPalette />
        <div className="flex space-x-3 items-center">
          <ConfigPallete />
        </div>
      </section>
      <Palette />
      <Navbar />
    </main>
  );
}
