const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

const app = express();
const PORT = 3000;

const MAP_SIZE = 8192;

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

  if (isNaN(gx) || isNaN(gy)) {
    return res.status(400).json({
      error: "Parâmetros x e y são obrigatórios"
    });
  }

  let { px, py } = gtaToPixel(gx, gy);

  px = Math.max(0, Math.min(MAP_SIZE - 1, px));
  py = Math.max(0, Math.min(MAP_SIZE - 1, py));

  const OUTPUT_SIZE = 1024;
  const canvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
  const ctx = canvas.getContext("2d");

  try {
    const mapImage = await loadImage(
      path.join(__dirname, "gta-map.jpeg")
    );

    ctx.drawImage(
      mapImage,
      0,
      0,
      MAP_SIZE,
      MAP_SIZE,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );

    const markerX = (px / MAP_SIZE) * OUTPUT_SIZE;
    const markerY = (py / MAP_SIZE) * OUTPUT_SIZE;

    drawGpsMarker(ctx, markerX, markerY, 14);

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache");
    res.send(canvas.toBuffer());
  } catch (err) {
    console.error("Erro ao gerar mapa:", err);
    res.status(500).json({ error: "Erro ao gerar mapa" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
