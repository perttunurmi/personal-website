window.onload = () => {
  setTimeout(() => {
    document.getElementById("fadein").remove();
  }, 1000);
};

// Canvas
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

function clear() {
  ctx.fillStyle = "#202020";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPoint(p) {
  const size = 20;
  ctx.fillStyle = "green";
  ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
}

function projectToScreen({ x, y, z }) {
  return {
    x: (x / z + 1) / 2 * canvas.width,
    y: (y / z + 1) / 2 * canvas.height,
  };
}

function rotationAroundY(angle, { x, y, z }) {
  return {
    x: x * Math.cos(angle) - z * Math.sin(angle),
    y: y,
    z: x * Math.sin(angle) + z * Math.cos(angle),
  };
}

function translate({ x, y, z }, dz) {
  return {
    x: x,
    y: y,
    z: z + dz,
  };
}

function drawline(p1, p2) {
  ctx.lineWidth = 5;
  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

const vertices = [
  { x: 0.25, y: 0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
  { x: -0.25, y: 0.25, z: -0.25 },

  { x: 0.25, y: 0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: -0.25, y: 0.25, z: 0.25 },
];

const faces = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

const FPS = 60;
let dangle = 0;
let dz = 1;

function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dt = 1 / FPS;

  dangle += (Math.PI / 4) * dt;

  for (const vertex of vertices) {
    drawPoint(projectToScreen(translate(rotationAroundY(dangle, vertex), dz)));
  }

  for (const face of faces) {
    for (let i = 0; i < face.length; i++) {
      const a = vertices[face[i]];
      const b = vertices[face[(i + 1) % face.length]];
      drawline(
        projectToScreen(translate(rotationAroundY(dangle, a), dz)),
        projectToScreen(translate(rotationAroundY(dangle, b), dz)),
      );
    }
  }
  setTimeout(frame, 1000 / FPS);
}

frame();
