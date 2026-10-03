setcpm(72 / 4)

stack(
  note("<[c3,e3,g3,b3] [a2,c3,e3,g3] [f2,a2,c3,e3] [g2,b2,d3,e3]>")
    .sound("triangle")
    .attack(0.7).decay(0.4).sustain(0.55).release(1.4)
    .lpf(1100).room(0.35).gain(0.12),

  note("<e5 g5 a5 g5> ~ <b4 e5 c5 d5> ~")
    .sound("sine")
    .attack(0.02).decay(0.7).sustain(0).release(0.6)
    .delay(0.18).delaytime(0.42).delayfeedback(0.2)
    .room(0.3).gain(0.16)
)
