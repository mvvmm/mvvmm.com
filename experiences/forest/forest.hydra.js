const CELLS = 30;
const CELL_SPEED = 0.3;
const WARP = 0.4;
const SWIRL = 0.2;
const LEAF_COLOR = [0.2, 0.6, 0.3];
const SHADE_COLOR = [0.1, 0.4, 0.2];
const SHADE_AMOUNT = 0.3;
const LIGHT_COLOR = [0.3, 0.5, 0.2];
const LIGHT_AMOUNT = 0.2;

voronoi(CELLS, CELL_SPEED)
  .modulate(noise(1, 0.2), WARP)
  .modulateRotate(osc(0.08).rotate(0.3), SWIRL)
  .color(...LEAF_COLOR)
  .modulate(voronoi(CELLS * 0.8, 0.5).color(...SHADE_COLOR), SHADE_AMOUNT)
  .blend(osc(0.15, 0.1, 0.4).color(...LIGHT_COLOR), LIGHT_AMOUNT)
  .out()
