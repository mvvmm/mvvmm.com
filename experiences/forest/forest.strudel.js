// Tempo
setcpm(60)

// Bass
$: note("<[c2 c3]*3 [bb1 bb2]*3 [g1 g2]*3 [f2 f3]*3>")
  .sound("gm_synth_bass_1")
  .lpf(900)

// Melody
$: n("<0 2 3 5 7 5 3 2>*2")
  .scale("C4:minor")
  .sound("gm_synth_strings_1")
  .room(0.3)

// Drums
$: sound("bd*4, [~ <sd cp>]*2, [hh ~]*4")
  .bank("RolandTR808")
  .gain(0.9)