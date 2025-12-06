osc(10, 0.1, 1.0)
  .posterize(16)
  .modulate(osc(5, 0.1).rotate(0.5), 0.3)
  .modulateRotate(osc(0.2).rotate(1.0), 0.2)
  .color(1.0, 0.0, 0.5)
  .modulate(osc(15, 0.2).color(0.0, 1.0, 1.0).rotate(1.5), 0.2)
  .blend(osc(20, 0.1).posterize(8).color(1.0, 0.5, 0.0), 0.3)
  .out()



