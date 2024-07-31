// utils/paletteUtils.ts

import {
  hexToCmyk,
  hexToRgb,
  hexToRgba,
  hexToHsl,
  hexToHsb,
} from "@/utils/colorUtils";

export const paletteToCSS = (palette: string[]) => {
  const formats = palette.map((color, index) => {
    const hex = color;
    const rgb = hexToRgb(color);
    const rgba = hexToRgba(color);
    const cmyk = hexToCmyk(color);
    const hsl = hexToHsl(color);
    const hsb = hexToHsb(color);

    return {
      hex: hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgba,
      cmyk,
      hsl,
      hsb,
    };
  });

  const hexVariables = formats
    .map((formats, index) => `--color-${index}-hex: ${formats.hex};`)
    .join("\n");
  const rgbVariables = formats
    .map((formats, index) => `--color-${index}-rgb: ${formats.rgb};`)
    .join("\n");
  const rgbaVariables = formats
    .map((formats, index) => `--color-${index}-rgba: ${formats.rgba};`)
    .join("\n");
  const cmykVariables = formats
    .map((formats, index) => `--color-${index}-cmyk: ${formats.cmyk};`)
    .join("\n");
  const hslVariables = formats
    .map((formats, index) => `--color-${index}-hsl: ${formats.hsl};`)
    .join("\n");
  const hsbVariables = formats
    .map((formats, index) => `--color-${index}-hsb: ${formats.hsb};`)
    .join("\n");

  return `
    /* HEX Colors */
    ${hexVariables}

    /* RGB Colors */
    ${rgbVariables}

    /* RGBA Colors */
    ${rgbaVariables}

    /* CMYK Colors */
    ${cmykVariables}

    /* HSL Colors */
    ${hslVariables}

    /* HSB Colors */
    ${hsbVariables}
  `
    .trim()
    .replace(/\n\s*\n/g, "\n\n");
};
