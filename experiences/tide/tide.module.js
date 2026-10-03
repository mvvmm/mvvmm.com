const SPEED = 0.6;
const LAYERS = 100;
const WARP = 0.9;
const POINTER_PULL = 0.35;
const LINE_DENSITY = 24;
const LINE_SHARPNESS = 0;
const LINE_BRIGHTNESS = 1;
const GLOW = 0;
const COLOR_SPREAD = 2.5;
const COLOR_DRIFT = 0.2;
const VIGNETTE = 1.1;
const FPS = 30;
const BACKGROUND = '#000';
const FALLBACK_BANDS = 44;
const FALLBACK_HUE = 235;
const FALLBACK_LINE_WIDTH = 1.5;

const float = (value) => Number(value).toFixed(4);

let canvas = document.querySelector('canvas');
const pointer = { x: 0.5, y: 0.5 };
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
    const dpr = Math.min(devicePixelRatio, 1.5);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);
  let frame;
  const started = performance.now();
  const draw = () => {
    const time = (performance.now() - started) / 1000 * SPEED;
    context.fillStyle = BACKGROUND;
    context.fillRect(0, 0, innerWidth, innerHeight);
    context.globalCompositeOperation = 'lighter';
    for (let band = 0; band < FALLBACK_BANDS; band++) {
      context.beginPath();
      for (let x = 0; x <= innerWidth + 8; x += 8) {
        const u = x / innerWidth;
        const wave = Math.sin(u * 7 + time + band * 0.14)
          * Math.cos(u * 3 - time * 0.7 + pointer.x * 3);
        const y = innerHeight * (0.15 + band / 60 + wave * (0.10 + pointer.y * 0.13));
        if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.strokeStyle = `hsla(${FALLBACK_HUE + band * 3 + Math.sin(time) * 25}, 85%, 65%, 0.5)`;
      context.lineWidth = FALLBACK_LINE_WIDTH;
      context.stroke();
    }
    context.globalCompositeOperation = 'source-over';
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
  const tide = effect(gpu, `
    struct Params { time: f32, aspect: f32, pointer: vec2f }
    @group(0) @binding(0) var<uniform> params: Params;
    @fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
      var p = (uv - 0.5) * vec2f(params.aspect, 1.0);
      p += (params.pointer - 0.5) * ${float(POINTER_PULL)};
      let t = params.time;
      var field = 0.0;
      for (var i = 0; i < ${Math.round(LAYERS)}; i++) {
        let n = f32(i) + 1.0;
        p += vec2f(sin(p.y * n * 3.0 + t), cos(p.x * n * 2.0 - t)) * ${float(WARP)};
        field += sin(p.x * n * 3.0 + p.y * 5.0 + t) / n;
      }
      let color = 0.5 + 0.5 * cos(field * ${float(COLOR_SPREAD)} + vec3f(0.0, 2.0, 4.0) + t * ${float(COLOR_DRIFT)});
      let lines = pow(0.5 + 0.5 * sin(field * ${float(LINE_DENSITY)}), ${float(LINE_SHARPNESS)});
      let vignette = max(0.0, 1.0 - length(uv - 0.5) * ${float(VIGNETTE)});
      return vec4f((color * ${float(GLOW)} + lines * color * ${float(LINE_BRIGHTNESS)}) * vignette, 1.0);
    }
  `, { set: { params: { time: 0, aspect: innerWidth / innerHeight, pointer: [0.5, 0.5] } } });
  const time = clock(gpu);
  loop = frameLoop(gpu, (frame) => {
    tide.set({ params: {
      time: time.time * SPEED,
      aspect: innerWidth / innerHeight,
      pointer: [pointer.x, pointer.y],
    } });
    frame.pass(target, tide);
  }, { fps: FPS });
  canvas.dataset.renderer = 'vgpu';
  addEventListener('pagehide', () => { loop.stop(); gpu.dispose(); }, { once: true });
} catch (error) {
  loop?.stop();
  gpu?.dispose();
  startFallback(error.message);
}
