const MAX_CIRCLES = 50;
const SPAWN_INTERVAL = 10;
const START_RADIUS = 10;
const GROWTH_RATE = 1.05;

let time = 0;
const circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function step() {
  for (const circle of circles) {
    circle.radius *= GROWTH_RATE;
  }
  if (time === 0) {
    circles.push({
      radius: START_RADIUS,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    });
    if (circles.length > MAX_CIRCLES) {
      circles.shift();
    }
  }

  if (time === SPAWN_INTERVAL) {
    time = 0;
  } else {
    time += 1;
  }
}

function draw() {
  noStroke();
  for (const circle of circles) {
    fill(circle.color);
    ellipse(windowWidth / 2, windowHeight / 2, circle.radius);
  }
  step();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
