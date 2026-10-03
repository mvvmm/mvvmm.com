const FREQUENCY = 10;
const SPEED = 0.1;
const LEVELS = 16;
const WARP = 0.3;
const TWIST = 0.2;
const COLOR = [1.0, 0.0, 0.5];
const GLOW_COLOR = [0.0, 1.0, 1.0];
const GLOW_AMOUNT = 0.2;
const ACCENT_COLOR = [1.0, 0.5, 0.0];
const ACCENT_AMOUNT = 0.3;

osc(FREQUENCY, SPEED, 1.0)
  .posterize(LEVELS)
  .modulate(osc(5, 0.1).rotate(0.5), WARP)
  .modulateRotate(osc(0.2).rotate(1.0), TWIST)
  .color(...COLOR)
  .modulate(osc(15, 0.2).color(...GLOW_COLOR).rotate(1.5), GLOW_AMOUNT)
  .blend(osc(20, 0.1).posterize(8).color(...ACCENT_COLOR), ACCENT_AMOUNT)
  .out()
