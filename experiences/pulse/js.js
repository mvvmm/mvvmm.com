let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  fill(0, 0, 0, 5);
  rect(0, 0, windowWidth, windowHeight);

  translate(windowWidth / 2, windowHeight / 2);
  rotate(angle);

  for (let i = 0; i < 6; i++) {
    push();
    rotate((TWO_PI / 6) * i);

    const hue = (angle * 50 + i * 60) % 360;
    const size = 100 + sin(angle * 3 + i) * 30;

    fill(hue, 80, 90, 70);
    noStroke();
    rect(150, 0, size, size);
    pop();
  }

  angle += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
