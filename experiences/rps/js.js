let board;
let looping = true;
let fr = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  board = new Board();
  board.init();
  board.show();
  frameRate(10);
}

function draw() {
  background(0);
  board.update();
  board.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  board.resize();
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    fr++;
  }
  if (keyCode === LEFT_ARROW) {
    fr--;
  }
  frameRate(fr);
}
