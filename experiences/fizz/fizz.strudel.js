setcpm(90 / 4)

stack(
  note("<[d3,a3,c#4,e4,f#4] [e3,g#3,b3,e4] [b2,f#3,a3,d4] [a2,e3,g#3,c#4]>")
    .sound("triangle")
    .attack(1).decay(0.5).sustain(0.6).release(3)
    .lpf(1200).room(0.7).size(0.85).gain(0.09),

  n("[0 2 4 7 9 7 4 2]*2")
    .scale("D5:lydian")
    .sound("sine")
    .degradeBy(0.35)
    .decay(0.12).sustain(0)
    .pan(rand).gain(rand.range(0.05, 0.12))
    .delay(0.4).delaytime(0.166).delayfeedback(0.4)
    .room(0.5),

  sound("bd ~ bd ~ ~ ~ ~ ~").bank("RolandTR808").lpf(200).gain(0.6),

  sound("hh*16").bank("RolandTR808")
    .gain(perlin.range(0.02, 0.08))
    .pan(rand),

  note("<c2 c#2>")
    .sound("sawtooth")
    .lpf(300)
    .gain(sine.range(0, 0.05).slow(32))
)
