function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

function draw() {
  background(0);
  rotateY(0);

  for (let j = 0; j < 3; j++) {
    push();
    for (let i = 0; i < 100; i++) {
      translate(
        sin(frameCount * 0.005 + j) * 100,
        sin(frameCount * 0.005 + j) * 100,
        i * 0.1,
      );
      rotateZ(frameCount * 0.002);
      push();
      torus(10, 20);
      pop();
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
