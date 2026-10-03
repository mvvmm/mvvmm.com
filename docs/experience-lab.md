# Experience lab

Plan ten new experiences alongside the existing ten. Start with abstract,
interactive generative art, then explore toys and sound in small batches.

| Experience         | Visual / interaction                                    | Tool                          | Status    |
| ------------------ | ------------------------------------------------------- | ----------------------------- | --------- |
| Garden             | Luminous orbiting beads; move the camera, hold to bloom | Three.js instancing           | Prototype |
| Tide               | Iridescent flowing field; move to bend it               | vgpu / WGSL, Canvas fallback  | Prototype |
| Gravity Well       | Particle swarm; drag an attractor, release to scatter   | Three.js, later GPU compute   | Planned   |
| Glass Choir        | Floating glass shapes; tap to play notes                | Three.js + Strudel            | Planned   |
| Impossible Hallway | Endless architecture; steer and change rooms            | Three.js                      | Planned   |
| Ink Weather        | Clouds of ink; paint currents with the pointer          | Canvas, later vgpu simulation | Planned   |
| Reaction Garden    | Growing coral patterns; plant seeds                     | vgpu reaction–diffusion       | Planned   |
| Luminous Loom      | Animated textile; drag to distort threads               | vgpu shader                   | Planned   |
| Echo Chamber       | Feedback kaleidoscope; change symmetry and tempo        | Hydra + Strudel               | Planned   |
| Tiny Cosmos        | Miniature universe; place planets with orbital trails   | Three.js                      | Planned   |

## Experiment in batches

1. Compare the two prototypes. Edit `RINGS`, `BEADS`, and `PALETTE` in Garden,
   or `SPEED` and the shader in Tide. Inspect the canvas's `data-renderer`
   attribute to check the active renderer. Choose the visual direction after
   seeing both in motion.
2. Build Gravity Well, Impossible Hallway, and Tiny Cosmos to explore interaction.
3. Build Ink Weather, Reaction Garden, and Luminous Loom after proving GPU
   availability inside the actual preview sandbox.
4. Add Glass Choir and Echo Chamber with explicit audio activation. Gallery
   previews should stay silent.

For each experience: an interesting idle state, one discoverable interaction,
and a few obvious editable values. Verify gallery and editor sizes, resize,
pointer/touch, pause/resume, live edits, and navigation away. Aim for 30 fps in
the gallery and 60 fps in the editor, measuring on a phone before raising
complexity. Add reduced-motion behavior before promoting prototypes to finished
experiences.

## Module support

The two prototypes also include editable `.strudel.js` soundtracks. Garden
uses warm chords and sparse bell-like notes at 72 BPM; Tide adds a
rounded bass pulse at 84 BPM. Both use quiet sine/triangle synths, with no new
samples. The existing speaker button controls audio, and gallery previews stay
silent.

Files ending in `.module.js` now run as ES modules with imports and top-level
await. Other file types retain their existing behavior. Put a pinned import map
in `scripts.html`, before any module scripts:

```html
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js",
      "vgpu": "https://esm.sh/vgpu@0.5.0?bundle"
    }
  }
</script>
```

Libraries load only inside the relevant iframe, not the React editor bundle.
vgpu accepts inline WGSL strings, which makes shaders editable without a shader
build plugin. Each module has its own scope. Local files are embedded in
`srcdoc`, so relative imports such as `import './helper.module.js'` are not
supported; use one module per prototype. Later: virtual module resolution,
editable `.wgsl` files, and locally served pinned library bundles to remove the
CDN dependency.

## GPU compatibility

Keep `sandbox="allow-scripts"`. WebGPU depends on browser, GPU, secure context,
and iframe restrictions. Check availability inside the preview. Do not add
`allow-same-origin` to editable same-origin code just to enable a demo; evaluate
a dedicated preview origin if the sandbox prevents WebGPU.

Tide records its renderer on the canvas and uses a related Canvas ribbon animation
when WebGPU is absent or library/adapter/shader setup fails. It is not an
identical rendering of the GPU shader. Runtime device-loss recovery is still
future work. Pause unloads the iframe; resume or an edit creates a fresh context.
Three.js currently uses WebGL; its WebGPURenderer is a separate future experiment.

Type checks and the production build pass. Browser rendering, input, CDN imports,
and the real GPU path still need verification once a browser is connected.

## Sources

- [Three.js WebGPURenderer guide](https://threejs.org/manual/pages/webgpurenderer)
- [vgpu source and quick start](https://github.com/vercel-labs/vgpu)
- [vgpu documentation](https://vgpu.sh/docs)
