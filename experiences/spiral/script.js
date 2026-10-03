const SPIRALS = 3;
const TORI = 100;
const DRIFT = 100;
const DRIFT_SPEED = 0.005;
const SPIN_SPEED = 0.002;
const DEPTH_STEP = 0.1;
const TORUS_RADIUS = 10;
const TUBE_RADIUS = 20;
const BACKGROUND = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

function draw() {
  background(BACKGROUND);

  for (let j = 0; j < SPIRALS; j++) {
    push();
    for (let i = 0; i < TORI; i++) {
      translate(
        sin(frameCount * DRIFT_SPEED + j) * DRIFT,
        sin(frameCount * DRIFT_SPEED + j) * DRIFT,
        i * DEPTH_STEP,
      );
      rotateZ(frameCount * SPIN_SPEED);
      torus(TORUS_RADIUS, TUBE_RADIUS);
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
