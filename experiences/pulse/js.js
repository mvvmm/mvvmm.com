const SHAPES = 6;
const ORBIT_RADIUS = 150;
const SIZE = 100;
const SIZE_PULSE = 30;
const PULSE_SPEED = 3;
const SPIN_SPEED = 0.02;
const HUE_SPEED = 50;
const SATURATION = 80;
const BRIGHTNESS = 90;
const OPACITY = 70;
const TRAIL_FADE = 5;

let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  fill(0, 0, 0, TRAIL_FADE);
  rect(0, 0, windowWidth, windowHeight);

  translate(windowWidth / 2, windowHeight / 2);
  rotate(angle);

  for (let i = 0; i < SHAPES; i++) {
    push();
    rotate((TWO_PI / SHAPES) * i);

    const hue = (angle * HUE_SPEED + i * (360 / SHAPES)) % 360;
    const size = SIZE + sin(angle * PULSE_SPEED + i) * SIZE_PULSE;

    fill(hue, SATURATION, BRIGHTNESS, OPACITY);
    noStroke();
    rect(ORBIT_RADIUS, 0, size, size);
    pop();
  }

  angle += SPIN_SPEED;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
