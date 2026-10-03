const X_SCALE = 50;
const Y_SCALE = 50;
const X_OFFSET = 1500;
const Y_OFFSET = 500;
const SPEED = 0.1;
const ROUGHNESS = 0.2;
const HEIGHT = 200;
const TILT = Math.PI / 3;
const LINE_COLOR = 255;
const BACKGROUND = 0;

let cols, rows;
let w = window.innerWidth;
let h = window.innerHeight;
let x_noise, y_noise;
let y_loc = 0;
let heights;

function IX(x, y) {
  return x + y * w;
}

function setup() {
  createCanvas(w, h, WEBGL);

  cols = (w + X_OFFSET) / X_SCALE;
  rows = (h + Y_OFFSET) / Y_SCALE;
  heights = new Array(w * h).fill(0);
}

function draw() {
  y_loc -= SPEED;
  y_noise = y_loc;
  for (let y = 0; y < rows; y++) {
    x_noise = 0;
    for (let x = 0; x < cols; x++) {
      heights[IX(x, y)] = map(noise(x_noise, y_noise), 0, 1, -HEIGHT, HEIGHT);
      x_noise += ROUGHNESS;
    }
    y_noise += ROUGHNESS;
  }

  background(BACKGROUND);
  stroke(LINE_COLOR);
  noFill();

  rotateX(TILT);

  translate((-w - X_OFFSET) / 2, (-h - Y_OFFSET) / 2 - 150);
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x * X_SCALE, y * Y_SCALE, heights[IX(x, y)]);
      vertex(x * X_SCALE, (y + 1) * Y_SCALE, heights[IX(x, y + 1)]);
    }
    endShape();
  }
}

function windowResized() {
  w = window.innerWidth;
  h = window.innerHeight;

  cols = (w + X_OFFSET) / X_SCALE;
  rows = (h + Y_OFFSET) / Y_SCALE;
  heights = new Array(w * h).fill(0);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      heights[IX(x, y)] = random(-10, 10);
    }
  }

  resizeCanvas(w, h);
}
