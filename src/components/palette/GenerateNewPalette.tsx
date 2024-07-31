"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { usePalette } from "@/context/PaletteContext";

function GenerateNewPalette() {
  const { generateAndSaveNewPalette } = usePalette();

  return (
    <div>
      <Button size="sm" variant="default" onClick={generateAndSaveNewPalette}>
        Generate New Palette
      </Button>
    </div>
  );
}

export default GenerateNewPalette;
