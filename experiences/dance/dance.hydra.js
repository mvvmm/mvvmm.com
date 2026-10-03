const BPM = 118;
const PETALS = 8;
const FREQUENCY = 40;
const SWIRL = 0.6;
const SWAY = 0.08;
const SPIN = 0.05;
const PULSE = 0.06;
const MOUSE_PULL = 0.2;
const WARMTH = [1.0, 0.5, 0.75];
const GLOW_COLOR = [1.0, 0.85, 0.4];
const GLOW = 0.5;
const GLOW_SIZE = 0.12;
const SATURATION = 1.5;

const beat = () => Math.abs(Math.sin(time * Math.PI * BPM / 60));

osc(FREQUENCY, 0.08, 1.4)
  .kaleid(PETALS)
  .modulateRotate(osc(2, 0.1).kaleid(PETALS), SWIRL)
  .modulate(noise(2, 0.2), SWAY)
  .rotate(0, SPIN)
  .scale(() => 1 + beat() * PULSE)
  .color(...WARMTH)
  .add(
    shape(PETALS, GLOW_SIZE, 0.03)
      .scale(() => 1 + beat() * PULSE * 4)
      .rotate(0, -SPIN)
      .color(...GLOW_COLOR),
    GLOW,
  )
  .scroll(() => (mouse.x / innerWidth - 0.5) * MOUSE_PULL, () => (mouse.y / innerHeight - 0.5) * MOUSE_PULL)
  .saturate(SATURATION)
  .out()
