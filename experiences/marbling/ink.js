const NUM_VERTICES = 500;

class Drop {
  constructor(x, y, r) {
    this.center = createVector(x, y);
    this.r = r;
    this.vertices = [];
    this.color = color(random(0, 200), random(0, 200), random(0, 200));

    for (let i = 0; i < NUM_VERTICES; i++) {
      const angle = map(i, 0, NUM_VERTICES, 0, TWO_PI);
      const v = createVector(cos(angle), sin(angle));
      v.mult(this.r);
      v.add(this.center);
      this.vertices[i] = v;
    }
  }

  // https://people.csail.mit.edu/jaffer/Marbling/Dropping-Paint
  marble(other) {
    for (const v of this.vertices) {
      const c = other.center;
      const r = other.r;
      const p = v.copy();
      p.sub(c);
      const m = p.mag();

      const root = sqrt(1 + (r * r) / (m * m));
      p.mult(root);
      p.add(c);
      v.set(p);
    }
  }

  show() {
    fill(this.color);
    beginShape();
    for (const v of this.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}
