noise(4)
  .posterize(4)
  .modulate(osc(20, 0.1).modulate(noise(3), 0.5), 0.3)
  .modulateRotate(osc(0.5).modulate(noise(2), 0.8), 0.2)
  .color(1.0, 0.0, 1.0)
  .modulate(osc(10, 0.2).rotate(1.5).posterize(8), 0.15)
  .out()



