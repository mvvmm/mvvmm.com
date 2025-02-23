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
}
