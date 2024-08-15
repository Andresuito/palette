import jsPDF from 'jspdf';
import { hexToRgb, hexToRgba, hexToHsl, hexToHsb, hexToCmyk } from './colorUtils';

export async function generatePalettePDF(palette: { hex: string; name: string }[], formats: string[]): Promise<Uint8Array> {
  const doc = new jsPDF('l', 'mm', 'a4');
  const boxWidth = 60;
  const boxHeight = 60;
  const margin = 15;
  const borderRadius = 4;
  const pageHeight = doc.internal.pageSize.height;
  const titleFontSize = 18;
  const textFontSize = 12;
  const lineHeight = 8;
  let x = margin;
  let y = margin + titleFontSize + 20;

  const drawTitle = () => {
    doc.setFontSize(titleFontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text('palette', margin, margin + titleFontSize);
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

    y += Math.max(boxHeight, formatsY - y) + margin;

    if (y + boxHeight > pageHeight - margin) {
      doc.addPage();
      x = margin;
      y = margin + titleFontSize + 20;
      drawTitle();
    }
  });

  return doc.output('arraybuffer') as unknown as Uint8Array;
}