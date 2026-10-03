const PARTICLES = 4000;
const FLOW_SCALE = 0.0022;
const FLOW_CHANGE = 0.0015;
const FREEDOM_SCALE = 0.0012;
const FREEDOM_CHANGE = 0.002;
const FREEDOM_THRESHOLD = 0.5;
const FREE_SPEED = 2.2;
const MOLD_SPEED = 1.6;
const MOLD_DIRECTIONS = 4;
const MOLD_GRAY = 70;
const MOLD_OPACITY = 40;
const HUE_START = 300;
const HUE_RANGE = 240;
const SATURATION = 80;
const BRIGHTNESS = 100;
const OPACITY = 70;
const LINE_WEIGHT = 1.6;
const TRAIL_FADE = 6;
const RESPAWN_CHANCE = 0.004;
const POINTER_RADIUS = 160;

let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  particles = Array.from({ length: PARTICLES }, spawn);
}

function spawn() {
  const x = random(width);
  const y = random(height);
  return { x, y, px: x, py: y, hue: random(-20, 20) };
}

function freedom(x, y) {
  let value = noise(x * FREEDOM_SCALE + 100, y * FREEDOM_SCALE, frameCount * FREEDOM_CHANGE);
  if (mouseX || mouseY) {
    value += exp(-((x - mouseX) ** 2 + (y - mouseY) ** 2) / POINTER_RADIUS ** 2);
  }
  return value;
}

function draw() {
  noStroke();
  fill(0, 0, 0, TRAIL_FADE);
  rect(0, 0, width, height);
  strokeWeight(LINE_WEIGHT);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const angle = noise(p.x * FLOW_SCALE, p.y * FLOW_SCALE, frameCount * FLOW_CHANGE) * TWO_PI * 2;
    const free = freedom(p.x, p.y) > FREEDOM_THRESHOLD;
    const step = TWO_PI / MOLD_DIRECTIONS;
    const heading = free ? angle : round(angle / step) * step;
    const speed = free ? FREE_SPEED : MOLD_SPEED;

    p.px = p.x;
    p.py = p.y;
    p.x += cos(heading) * speed;
    p.y += sin(heading) * speed;

    if (free) {
      const hue = (HUE_START + noise(p.x * 0.0015, p.y * 0.0015, frameCount * 0.003) * HUE_RANGE + p.hue + 360) % 360;
      stroke(hue, SATURATION, BRIGHTNESS, OPACITY);
    } else {
      stroke(0, 0, MOLD_GRAY, MOLD_OPACITY);
    }
    line(p.px, p.py, p.x, p.y);

    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || random() < RESPAWN_CHANCE) {
      particles[i] = spawn();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
