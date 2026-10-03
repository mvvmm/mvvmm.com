setcpm(84 / 4)

stack(
  note("<d2 bb1 f2 c2>*4")
    .sound("sine")
    .attack(0.02).decay(0.3).sustain(0).release(0.15)
    .gain(0.22),

  note("<[d3,f3,a3,c4] [bb2,d3,f3,a3] [f3,a3,c4,e4] [c3,e3,g3,bb3]>")
    .sound("triangle")
    .attack(0.5).decay(0.3).sustain(0.5).release(0.9)
    .lpf(900).room(0.3).gain(0.1),

  note("<a4 f4 c5 g4> ~ <f4 d4 a4 e4> ~")
    .sound("sine")
    .attack(0.03).decay(0.4).sustain(0).release(0.3)
    .delay(0.15).delaytime(0.36).delayfeedback(0.18)
    .room(0.25).gain(0.13)
)
