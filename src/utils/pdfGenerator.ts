import jsPDF from 'jspdf';
import { hexToRgb, hexToRgba, hexToHsl, hexToHsb, hexToCmyk } from './colorUtils';

export async function generatePalettePDF(palette: { hex: string; name: string }[], formats: string[]): Promise<Uint8Array> {
  const boxWidth = 80;
  const boxHeight = 80;
  const margin = 30;
  const borderRadius = 4;
  const titleFontSize = 18;
  const textFontSize = 12;
  const lineHeight = 10;
  const initialY = margin + titleFontSize + 20;

  const totalHeight = initialY + palette.length * (boxHeight + margin);

  const doc = new jsPDF('l', 'mm', [totalHeight, 600]);

  let x = margin;
  let y = initialY;

  const drawTitle = () => {
    doc.setFontSize(titleFontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text('Palette', margin, margin + titleFontSize);
    doc.setFontSize(textFontSize);
    doc.setFont("helvetica", "normal");
  };

  drawTitle();

  const formatFunctions: { [key: string]: (hex: string) => string } = {
    'HEX': (hex) => hex,
    'RGB': (hex) => {
      const { r, g, b } = hexToRgb(hex);
      return `rgb(${r}, ${g}, ${b})`;
    },
    'RGBA': (hex) => hexToRgba(hex, 1),
    'HSL': (hex) => hexToHsl(hex),
    'HSB': (hex) => hexToHsb(hex),
    'CMYK': (hex) => hexToCmyk(hex),
  };

  palette.forEach(({ hex }) => {
    doc.setFillColor(hex);
    doc.roundedRect(x, y, boxWidth, boxHeight, borderRadius, borderRadius, 'F');

    const formatsStartX = x + boxWidth + margin;
    let formatsY = y + (boxHeight - (formats.length * lineHeight)) / 2;
    doc.setFontSize(textFontSize);
    formats.forEach((format) => {
      const formattedColor = formatFunctions[format] ? formatFunctions[format](hex) : hex;
      doc.setTextColor(50, 50, 50);
      doc.text(`${format}: ${formattedColor}`, formatsStartX, formatsY);
      formatsY += lineHeight;
    });

    y += boxHeight + margin;
  });

  doc.setProperties({
    title: 'palette',
  });

  return doc.output('arraybuffer') as unknown as Uint8Array;
}
