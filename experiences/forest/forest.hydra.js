voronoi(30, 0.3)
  .modulate(noise(1, 0.2), 0.4)
  .modulateRotate(osc(0.08).rotate(0.3), 0.2)
  .color(0.2, 0.6, 0.3)
  .modulate(voronoi(25, 0.5).color(0.1, 0.4, 0.2), 0.3)
  .blend(osc(0.15, 0.1, 0.4).color(0.3, 0.5, 0.2), 0.2)
  .out()



