const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const MAP_SIZE = 8192;
const OUTPUT_SIZE = 1024;

const OFFSET_X = 3760;
const OFFSET_Y = 5531;
const SCALE_X = 0.659;
const SCALE_Y = 0.678;

function gtaToPixel(gx, gy) {
  const px = OFFSET_X + gx * SCALE_X;
  const py = OFFSET_Y - gy * SCALE_Y;
  return { px, py };
}

function drawGpsMarker(ctx, x, y, size = 14) {
  ctx.save();

  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetY = 1;

  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y, size / 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

app.get("/map", async (req, res) => {
  const gx = Number(req.query.x);
  const gy = Number(req.query.y);
  let zoom = Number(req.query.zoom);

  if (isNaN(gx) || isNaN(gy)) {
    return res.status(400).json({
      error: "Parâmetros x e y são obrigatórios"
    });
  }

  if (isNaN(zoom) || zoom < 1) zoom = 1;
  if (zoom > 100) zoom = 100;

  let { px, py } = gtaToPixel(gx, gy);

  px = Math.max(0, Math.min(MAP_SIZE - 1, px));
  py = Math.max(0, Math.min(MAP_SIZE - 1, py));

  const canvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
  const ctx = canvas.getContext("2d");

  try {
    const mapImage = await loadImage(
      path.join(__dirname, "gta-map.jpeg")
    );

    const scaleFactor = 1 / zoom;
    const sourceWidth = MAP_SIZE * scaleFactor;
    const sourceHeight = MAP_SIZE * scaleFactor;

    const sourceX = px - sourceWidth / 2;
    const sourceY = py - sourceHeight / 2;

    const clampedX = Math.max(0, Math.min(MAP_SIZE - sourceWidth, sourceX));
    const clampedY = Math.max(0, Math.min(MAP_SIZE - sourceHeight, sourceY));

    ctx.drawImage(
      mapImage,
      clampedX,          // sx
      clampedY,          // sy
      sourceWidth,       // sWidth
      sourceHeight,      // sHeight
      0,                 // dx
      0,                 // dy
      OUTPUT_SIZE,       // dWidth
      OUTPUT_SIZE        // dHeight
    );

    const markerX = OUTPUT_SIZE / 2;
    const markerY = OUTPUT_SIZE / 2;

    const markerSize = 14 + (zoom - 1) * 0.4; 

    drawGpsMarker(ctx, markerX, markerY, markerSize);

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache");
    res.send(canvas.toBuffer());
  } catch (err) {
    console.error("Erro ao gerar mapa:", err);
    res.status(500).json({ error: "Erro ao gerar mapa" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`Exemplo: http://localhost:${PORT}/map?x=100&y=-200&zoom=10`);
});