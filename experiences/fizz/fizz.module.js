const SPEED = 1;
const SCALE = 1.6;
const RISE = 0.12;
const WARP = 3.2;
const WARMTH = 0.62;
const FEAR_DRIFT = 0.04;
const SPARKLE = 1.4;
const SPARKLE_SCALE = 24;
const SPARKLE_RISE = 0.9;
const POINTER_RADIUS = 0.45;
const POINTER_WARMTH = 0.8;
const BRIGHTNESS = 1.25;
const FEAR_COLORS = [[0.04, 0.04, 0.16], [0.12, 0.2, 0.42]];
const LOVE_COLORS = [[1.0, 0.32, 0.5], [1.0, 0.55, 0.32], [1.0, 0.84, 0.45], [0.72, 0.45, 1.0]];
const FPS = 60;
const FALLBACK_BLOBS = 9;

const float = (value) => Number(value).toFixed(4);
const vec3 = ([r, g, b]) => `vec3f(${float(r)}, ${float(g)}, ${float(b)})`;
const rgb = ([r, g, b], a) => `rgba(${r * 255 | 0}, ${g * 255 | 0}, ${b * 255 | 0}, ${a})`;

let canvas = document.querySelector('canvas');
const pointer = { x: -1, y: -1 };
addEventListener('pointermove', (event) => {
  pointer.x = event.clientX / innerWidth;
  pointer.y = event.clientY / innerHeight;
});

function startFallback(reason) {
  // WebGPU canvases can't switch to 2D
  const replacement = canvas.cloneNode();
  canvas.replaceWith(replacement);
  canvas = replacement;
  const context = canvas.getContext('2d');
  canvas.dataset.renderer = 'canvas2d';
  canvas.dataset.fallbackReason = reason;
  const resize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  resize();
  addEventListener('resize', resize);
  const colors = [...FEAR_COLORS, ...LOVE_COLORS, ...LOVE_COLORS];
  const blobs = Array.from({ length: FALLBACK_BLOBS }, (_, i) => ({
    color: colors[i % colors.length],
    phase: Math.random() * 100,
    radius: 0.35 + Math.random() * 0.4,
  }));
  let frame;
  const started = performance.now();
  const draw = () => {
    const time = (performance.now() - started) / 1000 * SPEED;
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = rgb(FEAR_COLORS[0], 1);
    context.fillRect(0, 0, innerWidth, innerHeight);
    context.globalCompositeOperation = 'lighter';
    const size = Math.max(innerWidth, innerHeight);
    for (const blob of blobs) {
      const x = (0.5 + Math.sin(time * 0.13 + blob.phase) * 0.45) * innerWidth;
      const y = (((blob.phase * 0.37 - time * RISE * 0.3) % 1.4 + 1.4) % 1.4 - 0.2) * innerHeight;
      const gradient = context.createRadialGradient(x, y, 0, x, y, blob.radius * size);
      gradient.addColorStop(0, rgb(blob.color, 0.55));
      gradient.addColorStop(1, rgb(blob.color, 0));
      context.fillStyle = gradient;
      context.fillRect(0, 0, innerWidth, innerHeight);
    }
    frame = requestAnimationFrame(draw);
  };
  draw();
  addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
}

let gpu;
let loop;
try {
  if (!navigator.gpu) throw new Error('WebGPU is unavailable in this browser or preview.');
  const { init, surface, effect, clock, frameLoop } = await import('vgpu');
  gpu = await init();
  const target = surface(gpu, canvas, { dpr: [1, 1.5] });
  const fizz = effect(gpu, `
    struct Params { time: f32, aspect: f32, pointer: vec2f }
    @group(0) @binding(0) var<uniform> params: Params;

    fn hash(p: vec2f) -> f32 {
      return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
    }

    fn noise(p: vec2f) -> f32 {
      let i = floor(p);
      let f = fract(p);
      let u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      return mix(
        mix(hash(i), hash(i + vec2f(1.0, 0.0)), u.x),
        mix(hash(i + vec2f(0.0, 1.0)), hash(i + vec2f(1.0, 1.0)), u.x),
        u.y,
      );
    }

    fn fbm(p: vec2f) -> f32 {
      let turn = mat2x2f(0.8, 0.6, -0.6, 0.8);
      var value = 0.0;
      var amplitude = 0.5;
      var q = p;
      for (var i = 0; i < 6; i++) {
        value += noise(q) * amplitude;
        q = turn * q * 2.03 + vec2f(1.7, 9.2);
        amplitude *= 0.5;
      }
      return value;
    }

    @fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
      let t = params.time;
      let screen = vec2f((uv.x - 0.5) * params.aspect, 0.5 - uv.y);
      let pointer = vec2f((params.pointer.x - 0.5) * params.aspect, 0.5 - params.pointer.y);
      let near = exp(-pow(length(screen - pointer) / ${float(POINTER_RADIUS)}, 2.0));

      let p = screen * ${float(SCALE)} - vec2f(0.0, t * ${float(RISE)});
      let q = vec2f(
        fbm(p + vec2f(0.0, t * 0.11)),
        fbm(p + vec2f(5.2, 1.3) - vec2f(t * 0.07, 0.0)),
      );
      let r = vec2f(
        fbm(p + ${float(WARP)} * q + vec2f(1.7, 9.2) + t * 0.15),
        fbm(p + ${float(WARP)} * q + vec2f(8.3, 2.8) - t * 0.12),
      );
      let f = fbm(p + ${float(WARP)} * r);

      let fear = fbm(screen * 0.9 + vec2f(t * ${float(FEAR_DRIFT)}, -t * ${float(FEAR_DRIFT)} * 1.3) + r * 0.6);
      let warmth = clamp(smoothstep(0.28, 0.62, fear + ${float(WARMTH)} - 0.5) + near * ${float(POINTER_WARMTH)}, 0.0, 1.0);

      let cold = mix(${vec3(FEAR_COLORS[0])}, ${vec3(FEAR_COLORS[1])}, smoothstep(0.2, 0.9, f));
      var warm = mix(${vec3(LOVE_COLORS[0])}, ${vec3(LOVE_COLORS[3])}, smoothstep(0.1, 0.9, length(q) * 0.9));
      warm = mix(warm, ${vec3(LOVE_COLORS[1])}, smoothstep(0.4, 0.9, r.x));
      warm = mix(warm, ${vec3(LOVE_COLORS[2])}, smoothstep(0.6, 0.95, f));
      var color = mix(cold, warm, warmth) * (0.35 + 1.1 * f * f + 0.25 * r.y);

      let fizz = fbm(screen * ${float(SPARKLE_SCALE)} + r * 4.0 - vec2f(0.0, t * ${float(SPARKLE_RISE)}));
      let glint = pow(smoothstep(0.62, 0.85, fizz), 4.0) * warmth * ${float(SPARKLE)};
      color += mix(${vec3(LOVE_COLORS[2])}, vec3f(1.0), 0.5) * glint;

      color = 1.0 - exp(-color * ${float(BRIGHTNESS)});
      return vec4f(color, 1.0);
    }
  `, { set: { params: { time: 0, aspect: innerWidth / innerHeight, pointer: [-1, -1] } } });
  const time = clock(gpu);
  loop = frameLoop(gpu, (frame) => {
    fizz.set({ params: {
      time: time.time * SPEED,
      aspect: innerWidth / innerHeight,
      pointer: [pointer.x, pointer.y],
    } });
    frame.pass(target, fizz);
  }, { fps: FPS });
  canvas.dataset.renderer = 'vgpu';
  addEventListener('pagehide', () => { loop.stop(); gpu.dispose(); }, { once: true });
} catch (error) {
  loop?.stop();
  gpu?.dispose();
  startFallback(error.message);
}
