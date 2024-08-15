import { hexToRgb, hexToRgba, hexToHsl, hexToCmyk, hexToHsb, getTextColor } from "./colorUtils";

const formatColor: { [key: string]: (hex: string) => string } = {
  HEX: (hex) => hex,
  RGB: (hex) => {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
  },
  RGBA: (hex) => hexToRgba(hex),
  HSL: (hex) => hexToHsl(hex),
  HSB: (hex) => hexToHsb(hex),
  CMYK: (hex) => hexToCmyk(hex),
};

export const generatePaletteImage = (
  colors: { hex: string; name: string }[],
  canvas: HTMLCanvasElement | null,
  formats: string[]
): string => {
  if (!canvas) return "";
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const numColumns = Math.min(colors.length, Math.floor(canvasWidth / 300));
  const colorWidth = canvasWidth / numColumns;
  const colorHeight = (canvasHeight - 100) / Math.ceil(colors.length / numColumns);
  const margin = 50;
  const textOffsetY = 40;
  const formatPadding = 10;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  colors.forEach((colorObj, index) => {
    const { hex, name } = colorObj;
    const x = (index % numColumns) * colorWidth;
    const y = Math.floor(index / numColumns) * colorHeight;

    ctx.fillStyle = hex;
    ctx.fillRect(x, y, colorWidth, colorHeight);

    ctx.fillStyle = getTextColor(hex);
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, x + colorWidth / 2, y + colorHeight / 2 - textOffsetY);

    formats.forEach((format, formatIndex) => {
      const formattedColor = formatColor[format](hex);
      ctx.font = "bold 24px Arial";
      ctx.fillText(`${format}: ${formattedColor}`, x + colorWidth / 2, y + colorHeight / 2 + (formatIndex * (30 + formatPadding)));
    });
  });

  ctx.fillStyle = "#000";
  ctx.font = "bold 38px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("palette", margin, canvasHeight - margin);

  return canvas.toDataURL();
};