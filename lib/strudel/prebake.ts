import { evalScope } from "@strudel/core";
import { aliasBank, registerSynthSounds, samples } from "@strudel/webaudio";
import * as core from "@strudel/core";

export async function prebake() {
  const modulesLoading = evalScope(
    core,
    import("@strudel/draw"),
    import("@strudel/mini"),
    import("@strudel/tonal"),
    import("@strudel/webaudio"),
    import("@strudel/codemirror"),
    import("@strudel/hydra"),
    import("@strudel/soundfonts"),
    import("@strudel/midi")
  );

  // load samples from various repositories
  const ds = "https://raw.githubusercontent.com/felixroos/dough-samples/main";
  const ts = "https://raw.githubusercontent.com/todepond/samples/main";
  const tc = "https://raw.githubusercontent.com/tidalcycles/uzu-drumkit/main";
  const dirt =
    "https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master";

  await Promise.all([
    modulesLoading,
    registerSynthSounds(),
    import("@strudel/soundfonts").then(({ registerSoundfonts }) =>
      registerSoundfonts()
    ),
    // Dough samples collection
    samples(`${ds}/tidal-drum-machines.json`),
    samples(`${ds}/piano.json`),
    samples(`${ds}/Dirt-Samples.json`),
    samples(`${ds}/vcsl.json`),
    samples(`${ds}/mridangam.json`),
    // Uzu drumkit
    samples(`${tc}/strudel.json`),
    // TidalCycles Dirt-Samples (comprehensive collection)
    samples(`${dirt}/strudel.json`),
  ]);

  // Load alias banks for easier sample naming
  aliasBank(`${ts}/tidal-drum-machines-alias.json`);
}
