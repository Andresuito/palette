import React, { Suspense } from "react";
import ConfigPallete from "@/components/palette/ConfigPalette/ConfigPalette";
import Palette from "@/components/palette/Palette";
import GenerateNewPalette from "@/components/palette/GenerateNewPalette";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/palette/Spinner";

export default function Home() {
  return (
    <main className="h-full">
      <section className="flex justify-between py-5 px-6">
        <GenerateNewPalette />
        <div className="flex space-x-3 items-center">
          <ConfigPallete />
        </div>
      </section>
      <Suspense fallback={<Spinner />}>
        <Palette />
      </Suspense>
      <Navbar />
    </main>
  );
}
