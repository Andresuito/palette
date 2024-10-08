"use client";

import { Button } from "@/components/ui/button";
import { usePalette } from "@/context/PaletteContext";

function GenerateNewPalette() {
  const { generateAndSaveNewPalette } = usePalette();

  return (
    <div>
      <Button variant="outline" onClick={generateAndSaveNewPalette}>
        Generate New Palette
      </Button>
    </div>
  );
}

export default GenerateNewPalette;
