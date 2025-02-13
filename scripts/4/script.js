const NUM_ROWS = 50;
const NUM_COLS = 50;
const THRESHOLD = 3; // Number of moore neighbors needed to win for a square to change

class Board {
  constructor() {
    this.rules = [1, 2, 0];
    this.colors = [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
    ];
    this.width = windowWidth / NUM_COLS;
    this.height = windowHeight / NUM_ROWS;
    this.num_rows = NUM_ROWS;
    this.num_cols = NUM_COLS;
    this.copy = Array(this.num_rows)
      .fill()
      .map(() => Array(this.num_cols).fill());
    this.board = Array(this.num_rows)
      .fill()
      .map(() => Array(this.num_cols).fill());
    this.threshold = THRESHOLD;
  }

  log() {
    console.log(this.board);
  }

  makeCopy() {
    for (let row = 0; row < this.num_rows; row++) {
      for (let col = 0; col < this.num_cols; col++) {
        this.copy[row][col] = this.board[row][col].value;
      }
    }
  }

  init() {
    for (let row = 0; row < this.num_rows; row++) {
      for (let col = 0; col < this.num_cols; col++) {
        this.board[row][col] = new Cell(col, row, this);
      }
    }
  }

  update() {
    this.makeCopy();
    for (let row = 0; row < this.num_rows; row++) {
      for (let col = 0; col < this.num_cols; col++) {
        this.board[row][col].update();
      }
    }
  }

  show() {
    for (let row = 0; row < this.num_rows; row++) {
      for (let col = 0; col < this.num_cols; col++) {
        let cell = this.board[row][col];
        fill(
          this.colors[cell.value][0],
          this.colors[cell.value][1],
          this.colors[cell.value][2],
        );
        rect(cell.x * cell.w, cell.y * cell.h, cell.w + 1, cell.h + 1);
      }
    }
  }

  resize() {
    for (let row = 0; row < this.num_rows; row++) {
      for (let col = 0; col < this.num_cols; col++) {
        this.board[row][col].resize();
      }
    }
  }
}

class Cell {
  constructor(x, y, board) {
    this.w = windowWidth / NUM_COLS;
    this.h = windowHeight / NUM_ROWS;
    this.x = x;
    this.y = y;
    this.value = int(random(0, 3));
    this.parent = board;

    // nw, n, ne, e, se, s, sw, w
    this.neighbors = new Array(8);
    this.neighbors[0] = x == 0 || y == 0 ? [0, 0] : [-1, -1];
    this.neighbors[1] = y == 0 ? [0, 0] : [0, -1];
    this.neighbors[2] =
      x == this.parent.num_cols - 1 || y == 0 ? [0, 0] : [1, -1];
    this.neighbors[3] = x == this.parent.num_cols - 1 ? [0, 0] : [1, 0];
    this.neighbors[4] =
      x == this.parent.num_cols - 1 || y == this.parent.num_rows - 1
        ? [0, 0]
        : [1, 1];
    this.neighbors[5] = y == this.parent.num_rows - 1 ? [0, 0] : [0, 1];
    this.neighbors[6] =
      x == 0 || y == this.parent.num_rows - 1 ? [0, 0] : [-1, 1];
    this.neighbors[7] = x == 0 ? [0, 0] : [-1, 0];
  }

  update() {
    let count = 0;
    for (const direction of this.neighbors) {
      if (
        this.parent.copy[this.y + direction[1]][this.x + direction[0]] ==
        this.parent.rules[this.value]
      )
        count++;
    }
    let th = this.parent.threshold;
    if (count >= th) {
      this.value = this.parent.rules[this.value];
    }
  }

  resize() {
    this.w = windowWidth / NUM_COLS;
    this.h = windowHeight / NUM_ROWS;
  }
}

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
