const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "gta-map.jpeg";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let scale = 0.15;

// Centro inicial do mapa
let offsetX = 4096;
let offsetY = 4096;

let panX = canvas.width / 2 - offsetX * scale;
let panY = canvas.height / 2 - offsetY * scale;

let dragging = false;
let lastX = 0;
let lastY = 0;

img.onload = draw;

function draw() {
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.setTransform(scale,0,0,scale,panX,panY);
  ctx.drawImage(img,0,0);

  // Marker (0,0)
  ctx.setTransform(1,0,0,1,0,0);
  const sx = offsetX * scale + panX;
  const sy = offsetY * scale + panY;

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(sx, sy, 12, 0, Math.PI * 2);
  ctx.fill();

  ox.innerText = offsetX.toFixed(0);
  oy.innerText = offsetY.toFixed(0);
}

canvas.addEventListener("mousedown", e => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener("mousemove", e => {
  if (!dragging) return;

  offsetX += (e.clientX - lastX) / scale;
  offsetY += (e.clientY - lastY) / scale;

  lastX = e.clientX;
  lastY = e.clientY;
  draw();
});

canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("mouseleave", () => dragging = false);

canvas.addEventListener("wheel", e => {
  e.preventDefault();

  const zoom = 1.1;
  scale *= e.deltaY < 0 ? zoom : 1 / zoom;
  scale = Math.max(0.05, Math.min(scale, 3));

  draw();
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});
