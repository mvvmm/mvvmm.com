const NOISE_SCALE = 4;
const LEVELS = 4;
const WARP = 0.3;
const TWIST = 0.2;
const COLOR = [1.0, 0.0, 1.0];
const SCANLINES = 10;
const SCANLINE_LEVELS = 8;
const SCANLINE_AMOUNT = 0.15;

noise(NOISE_SCALE)
  .posterize(LEVELS)
  .modulate(osc(20, 0.1).modulate(noise(3), 0.5), WARP)
  .modulateRotate(osc(0.5).modulate(noise(2), 0.8), TWIST)
  .color(...COLOR)
  .modulate(osc(SCANLINES, 0.2).rotate(1.5).posterize(SCANLINE_LEVELS), SCANLINE_AMOUNT)
  .out()
