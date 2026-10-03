setcpm(70 / 4)

stack(
  note("<d2 bb1 f2 c2>")
    .struct("x*8")
    .sound("square")
    .decay(0.08).sustain(0)
    .lpf(500).gain(0.08),

  note("<[d3,f3,a3] [bb2,d3,f3] [f3,a3,c4] [c3,e3,g3]>")
    .sound("triangle")
    .attack(1).decay(0.5).sustain(0.6).release(2)
    .lpf(1000).room(0.6).size(0.8).gain(0.08),

  n("<[0 ~ 2 4] [~ 5 4 ~] [2 ~ ~ 7] [6 5 4 ~]>")
    .scale("D4:minor")
    .sound("sine")
    .degradeBy(0.2)
    .nudge(rand.range(0, 0.04))
    .attack(0.05).decay(0.6).sustain(0.2).release(1)
    .vib(4).vibmod(0.1)
    .delay(0.3).delaytime(0.43).delayfeedback(0.35)
    .room(0.6).gain(0.18)
)
