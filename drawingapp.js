const canvas = document.getElementById("canvas");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const sizeEl = document.getElementById("size");
const colorEl = document.getElementById("color");
const clearEl = document.getElementById("clear");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");

const ctx = canvas.getContext("2d");

let size = 10;
let isDrawing = false;
let color = "black";
let x;
let y;
let drawing = [];
let index = -1;

function startPosition(e) {
  isDrawing = true;
  if (e.type === "touchstart") {
    x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  } else {
    x = e.clientX - canvas.getBoundingClientRect().left;
    y = e.clientY - canvas.getBoundingClientRect().top;
  }
  drawing.push([]);
  index++;
}

function endPosition() {
  isDrawing = false;
}

function draw(e) {
  if (!isDrawing) return;

  if (e.type === "touchmove") {
    e.preventDefault();
    x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  } else {
    x = e.clientX - canvas.getBoundingClientRect().left;
    y = e.clientY - canvas.getBoundingClientRect().top;
  }

  drawCircle(x, y);
  drawLine(x, y);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", draw);

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  drawing[index].push({ type: "circle", x, y, size, color });
}

function drawLine(x, y) {
  if (x === undefined || y === undefined) return;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 2;
  ctx.stroke();
  drawing[index].push({ type: "line", x, y, size, color });
}

function updateSizeOnScreen() {
  sizeEl.innerText = size;
}

increaseBtn.addEventListener("click", () => {
  size += 5;
  if (size > 50) {
    size = 50;
  }
  updateSizeOnScreen();
});

decreaseBtn.addEventListener("click", () => {
  size -= 5;
  if (size < 5) {
    size = 5;
  }
  updateSizeOnScreen();
});

colorEl.addEventListener("change", (e) => (color = e.target.value));

clearEl.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawing = [];
  index = -1;
});

undoBtn.addEventListener("click", () => {
  if (index > 0) {
    index--;
    redraw();
  }
});

redoBtn.addEventListener("click", () => {
  if (index < drawing.length - 1) {
    index++;
    redraw();
  }
});

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i <= index; i++) {
    for (let j = 0; j < drawing[i].length; j++) {
      const { type, x, y, size, color } = drawing[i][j];
      if (type === "circle") {
        drawCircle(x, y);
      } else if (type === "line") {
        drawLine(x, y);
      }
    }
  }
}
