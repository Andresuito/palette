"use client";

import React, { useEffect } from "react";
import { usePalette } from "@/context/PaletteContext";
import Spinner from "./Spinner";
import ColorCard from "./ColorCard";

function Palette() {
  const { colors, generateAndSaveNewPalette } = usePalette();

  useEffect(() => {
    if (colors.length === 0) {
      generateAndSaveNewPalette();
    }
  }, [generateAndSaveNewPalette, colors.length]);

  if (colors.length === 0) {
    return <Spinner />;
  }

  return (
    <section className="flex flex-col xl:flex-row gap-5 xl:h-[90%] px-6 mb-10">
      {colors.map((color, index) => (
        <ColorCard key={index} color={color} index={index} />
      ))}
    </section>
  );
}

export default Palette;
