setcpm(118 / 4)

stack(
  sound("bd*4").bank("RolandTR909").gain(0.75),
  sound("~ cp ~ cp").bank("RolandTR909").room(0.2).gain(0.4),
  sound("[~ oh]*4").bank("RolandTR909").gain(0.18),
  sound("hh*16").bank("RolandTR909").gain(perlin.range(0.04, 0.12)),

  note("<[f1 f2]*4 [c2 c3]*4 [d2 d3]*4 [bb1 bb2]*4>")
    .sound("gm_synth_bass_1")
    .lpf(1200).gain(0.45),

  note("<[f3,a3,c4,e4] [c3,e3,g3,d4] [d3,f3,a3,c4] [bb2,d3,f3,a3]>")
    .struct("~ x ~ x ~ x ~ [x x]")
    .sound("gm_epiano1")
    .room(0.3).gain(0.3),

  n("<[4 ~ 5 4] [4 ~ 6 4] [5 ~ 4 2] [3 2 ~ 0]>")
    .scale("F4:major")
    .sound("gm_choir_aahs")
    .attack(0.05).release(0.6)
    .room(0.5).size(0.7).gain(0.35),

  n("[0 2 4 7]*2")
    .scale("F5:major:pentatonic")
    .sound("gm_celesta")
    .degradeBy(0.5)
    .delay(0.3).delaytime(0.38).delayfeedback(0.35)
    .room(0.6).gain(0.15)
)
