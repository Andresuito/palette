export const generatePaletteImage = (
  colors: string[],
  canvas: HTMLCanvasElement | null
) => {
  if (!canvas) return "";
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const numColumns = Math.min(colors.length, Math.floor(canvasWidth / 300));
  const colorWidth = canvasWidth / numColumns;
  const colorHeight = canvasHeight - 100;
  const margin = 50;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  colors.forEach((color, index) => {
    const x = (index % numColumns) * colorWidth;
    const y = Math.floor(index / numColumns) * colorHeight;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, colorWidth, colorHeight);
  });

  ctx.fillStyle = "#000";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("palette", margin, canvasHeight - margin);

  return canvas.toDataURL();
};
