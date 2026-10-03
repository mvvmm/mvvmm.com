const FRAME_RATE = 10;

let board;
let fr = FRAME_RATE;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  board = new Board();
  board.init();
  board.show();
  frameRate(fr);
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
