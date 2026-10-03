setcpm(76 / 4)

stack(
  note("<[a2,e3,b3] [f2,c3,g3] [c3,g3,d4] [g2,d3,a3]>").slow(2)
    .sound("triangle")
    .attack(1.5).decay(1).sustain(0.6).release(3)
    .lpf(sine.range(600, 1400).slow(16))
    .room(0.6).size(0.8).gain(0.1),

  note("<a1 f1 c2 g1>").slow(2)
    .struct("x ~ ~ x ~ x ~ ~")
    .sound("gm_acoustic_bass")
    .lpf(700).gain(0.5),

  n("0 [2 4] ~ 7 [~ 4] 5 ~ <2 9>")
    .scale("A4:minor:pentatonic")
    .sound("gm_kalimba")
    .degradeBy(0.2)
    .delay(0.25).delaytime(0.375).delayfeedback(0.3)
    .room(0.4).gain(0.45),

  note("~ ~ [e6 g6] ~ ~ ~ [a6 c7] ~").slow(2)
    .sound("sine")
    .attack(0.005).decay(0.06).sustain(0)
    .degradeBy(0.4).pan(rand)
    .room(0.7).gain(0.08),

  sound("bd ~ ~ [~ bd] ~ ~ bd ~").bank("RolandTR808").lpf(300).gain(0.7),
  sound("~ ~ rim ~ ~ <~ rim> ~ rim").bank("RolandTR808").room(0.3).gain(0.35),

  sound("hh*8").bank("RolandTR808")
    .gain(perlin.range(0.05, 0.2))
    .pan(sine.slow(4))
)
