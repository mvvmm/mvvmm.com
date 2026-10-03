# AGENTS.md

## Experiences

- Keep comments in `experiences/` extremely minimal. Most code needs no comment.
  When one is necessary, keep it to a few words.
- Experience names (folder names under `experiences/`) are a single word.
- Experiences exist so people can open them in the editor and play around.
  Put tweakable values (speeds, counts, sizes, colors, tempos, notes, volumes)
  at the top of each file as `ALL_CAPS` constants instead of inline literals.
  Prefer more toggles over fewer, and keep them all at the top. This does not
  apply to Strudel (`.strudel.js`) files; keep their patterns inline.
- Every experience has a `meta.json` with a `createdAt` date (`YYYY-MM-DD`).
  The gallery orders experiences newest first.

## Visual taste

Aim for abstract, full-screen visuals: color, shape, and movement filling the
whole frame. Favorites: tide, the Hydra pieces (forest, glitch, neon, dance),
rps, and marbling. Disliked: fizz. Lukewarm: mold.

Do:

- Fill the screen edge to edge. Color fields, flowing lines, and textures
  should cover the frame, not sit as an object in the middle of black space.
- Use continuous fields over discrete objects: shader math, noise, domain
  warping, feedback, and modulation (tide's contour lines, Hydra's layered
  oscillators).
- Let the image emerge from a system: simple local rules that create complex
  patterns (rps's cellular automaton, marbling's ink math). The result should
  be surprising, not designed frame by frame.
- Keep everything moving organically. Use flowing, swirling, breathing motion
  at several speeds, never constant linear motion.
- Use rich, saturated, layered color that shifts and blends.
- Translate a prompt's feeling into abstract qualities like color temperature,
  motion, density, and tension, not literal illustrations.

Avoid:

- Literal metaphors and illustrations, such as bubbles for "effervesce" or a
  grid for "mold". Evoke the feeling instead of depicting the words.
- Regular, robotic placement: shapes on visible grid cells, uniform sizes,
  predictable repetition.
- Small clip-art shapes (circles, rings, dots) as the main subject.
- Large empty or flat backgrounds, and muddy, foggy, or desaturated palettes.
- Narrative sequences that play once (fog clearing over 20 seconds). An
  experience should look great in any frame, at any moment.
