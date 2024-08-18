"use client";

import React, { useEffect } from "react";
import { usePalette } from "@/context/PaletteContext";
import Spinner from "./Spinner";
import ColorCard from "./ColorCard";
import { useSearchParams, useRouter } from "next/navigation";
import { findClosestColorName } from "@/utils/colorUtils";

function Palette() {
  const { colors, setColors, generateAndSaveNewPalette } = usePalette();
  const searchParams = useSearchParams();
  const router = useRouter();

  const colorsHexString = searchParams.get("") || "";
  const colorsHex = colorsHexString.split("-");

  useEffect(() => {
    const isValidColors =
      colorsHex.length > 0 &&
      colorsHex.every((color) => /^#?[0-9A-Fa-f]{6}$/.test(color));

    if (isValidColors) {
      const formattedColors = colorsHex.map((hex) => ({
        hex: hex.startsWith("#") ? hex : `#${hex}`,
        name: findClosestColorName(hex.startsWith("#") ? hex : `#${hex}`),
        isPinned: false,
      }));

      if (JSON.stringify(formattedColors) !== JSON.stringify(colors)) {
        setColors(formattedColors);
      }

      if (searchParams.get("") !== "") {
        router.replace("/");
      }
    } else if (colors.length === 0) {
      generateAndSaveNewPalette();
    }
  }, [
    colorsHex,
    setColors,
    generateAndSaveNewPalette,
    colors,
    router,
    searchParams,
  ]);

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
