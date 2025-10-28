const MAX_CIRCLES = 50;
const SPAWN_INTERVAL = 10;

let time = 0;
const circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function step() {
  for (i in circles) {
    const circle = circles[i];
    circle.radius = circle.radius * 1.05;
  }
  if (time === 0) {
    const circle = {
      radius: 10,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
    circles.push(circle);
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
  for (i in circles) {
    const circle = circles[i];
    noStroke();
    fill(circle.color);
    ellipse(windowWidth / 2, windowHeight / 2, circle.radius);
  }
  step();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
