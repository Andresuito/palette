import jsPDF from 'jspdf';

export async function generatePalettePDF(palette: string[]): Promise<Uint8Array> {
  const doc = new jsPDF('l', 'mm', 'a4');
  const boxWidth = 60;
  const boxHeight = 60;
  const margin = 8;
  const borderRadius = 2;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const titleFontSize = 16;
  const textFontSize = 12;
  let x = margin;
  let y = margin + titleFontSize + 10;

  const drawTitle = () => {
    doc.setFontSize(titleFontSize);
    doc.text('Palette', margin, margin + titleFontSize);
    doc.setFontSize(textFontSize);
  };

  drawTitle();

  palette.forEach((color) => {
    doc.setFillColor(color);
    doc.roundedRect(x, y, boxWidth, boxHeight, borderRadius, borderRadius, 'F');

    doc.setTextColor(0, 0, 0);
    doc.text(color, x + 2, y + boxHeight + 10);

    x += boxWidth + margin;

    if (x + boxWidth > pageWidth - margin) {
      x = margin;
      y += boxHeight + 20;

      if (y + boxHeight > pageHeight - margin) {
        doc.addPage();
        x = margin;
        y = margin + titleFontSize + 10;
        drawTitle();
      }
    }
  });

  return doc.output('arraybuffer') as unknown as Uint8Array;
}
