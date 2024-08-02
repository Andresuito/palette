import colorNameList from "color-name-list";

export const isValidHex = (hex: string) => /^#[0-9A-F]{6}$/i.test(hex);
export const isPartialHex = (hex: string) => /^#[0-9A-F]{0,6}$/i.test(hex);

export const hexToCmyk = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return `cmyk(${(c * 100).toFixed(1)}, ${(m * 100).toFixed(1)}, ${(y * 100).toFixed(1)}, ${(k * 100).toFixed(1)})`;
};


export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};


export const hexToRgba = (hex: string, alpha: number = 1) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const hexToHsl = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${(h * 360).toFixed(1)}, ${(s * 100).toFixed(1)}, ${(l * 100).toFixed(1)})`;
};


export const hexToHsb = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const h = max === min ? 0 : max === rNorm
    ? (gNorm - bNorm) / (max - min) + (gNorm < bNorm ? 6 : 0)
    : max === gNorm
    ? (bNorm - rNorm) / (max - min) + 2
    : (rNorm - gNorm) / (max - min) + 4;
  const s = max === 0 ? 0 : (max - min) / max;
  const v = max;

  return `hsb(${Math.round(h * 60)}, ${Math.round(s * 100)}, ${Math.round(v * 100)})`;
};


export const generateRandomColorFromList = () => {
  const randomIndex = Math.floor(Math.random() * colorNameList.length);
  const { hex, name } = colorNameList[randomIndex];
  return { hex, name };
};

const calculateColorDistance = (color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }) => {
  const dr = color1.r - color2.r;
  const dg = color1.g - color2.g;
  const db = color1.b - color2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

export const findClosestColorName = (hex: string) => {
  const targetRgb = hexToRgb(hex);
  
  let closestColor = { name: "Unknown", hex: "#000000" };
  let smallestDistance = Infinity;

  for (const color of colorNameList) {
    const colorRgb = hexToRgb(color.hex);
    const distance = calculateColorDistance(targetRgb, colorRgb);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestColor = color;
    }
  }

  return closestColor.name;
};


export const getTextColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "black" : "white";
};
