const NUM_ROWS = 50;
const NUM_COLS = 50;
const THRESHOLD = 3;

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
    this.width = windowWidth / NUM_COLS;
    this.height = windowHeight / NUM_ROWS;
  }
}
