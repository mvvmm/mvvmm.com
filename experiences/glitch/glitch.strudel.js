setcpm(100 / 4)

stack(
  sound("bd ~ ~ bd ~ ~ bd ~, ~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR909").gain(0.8),
  sound("~ ~ ~ ~ ~ ~ ~ [~ sd]").bank("RolandTR909").gain(0.25),

  sound("hh*8").bank("RolandTR909")
    .gain("0.3 0.15")
    .sometimesBy(0.15, (x) => x.ply(3)),

  note("<[e1 ~ e2 ~ ~ e1 ~ g1] [c2 ~ c2 ~ ~ b1 ~ c2] [g1 ~ g2 ~ ~ g1 ~ a1] [d2 ~ d2 ~ ~ c2 ~ b1]>")
    .sound("sawtooth")
    .decay(0.3).sustain(0.4).release(0.1)
    .lpf(450).gain(0.35),

  note("<[e3,g3,b3,d4] [c3,e3,g3,b3] [g2,b2,d3,f#3] [d3,f#3,a3,e4]>")
    .struct("x x ~ x ~ x x ~")
    .sound("triangle")
    .decay(0.2).sustain(0)
    .lpf(1800).room(0.4).gain(0.12),

  n("0 ~ 2 3 ~ 4 ~ <2 5>")
    .scale("E4:minor:pentatonic")
    .sound("square")
    .mask("<1 0 1 1>")
    .sometimesBy(0.2, (x) => x.ply(2))
    .decay(0.15).sustain(0.1)
    .lpf(2400).crush(10)
    .delay(0.3).delaytime(0.3).delayfeedback(0.3)
    .gain(0.12)
)
