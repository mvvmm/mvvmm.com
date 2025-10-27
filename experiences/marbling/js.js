const drops = [];
const MAX_DROPS = 250;
const MIN_DROP_RADIUS = 25;
const MAX_DROP_RADIUS = 125;
const DROP_INTERVAL = 2;
const BACKGROUND_COLOR = 0;

function dropInk() {
  const x = random(width);
  const y = random(height);
  const r = random(MIN_DROP_RADIUS, MAX_DROP_RADIUS);
  const drop = new Drop(x, y, r);

  for (const other of drops) {
    other.marble(drop);
  }

  drops.push(drop);

  if (drops.length > MAX_DROPS) {
    drops.shift();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(BACKGROUND_COLOR);
}

function draw() {
  background(BACKGROUND_COLOR);
  if (frameCount % DROP_INTERVAL === 0) {
    dropInk();
  }
  for (const drop of drops) {
    drop.show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
