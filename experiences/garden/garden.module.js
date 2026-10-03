import * as THREE from 'three';

const SPEED = 0.25;
const FLIGHT_SPEED = 0.6;
const HILLS = 0.12;
const HILL_HEIGHT = 2.2;
const RIPPLES = 0.45;
const RIPPLE_HEIGHT = 0.35;
const BLOSSOMS = 0.22;
const SHINE = 0.6;
const GROUND_COLORS = [0x0b3d2a, 0x2bb673, 0xa8f0c0];
const BLOSSOM_COLORS = [0xff4fa0, 0xffc04a, 0xb47cff];
const FOG_COLOR = 0x000000;
const FOG = 0.028;
const CAMERA_HEIGHT = 3;
const CAMERA_TILT = 1.15;
const POINTER_STEER = 2.5;
const DETAIL = 320;

const color = (hex) => new THREE.Color(hex);

const scene = new THREE.Scene();
scene.background = color(FOG_COLOR);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 120);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const uniforms = {
  time: { value: 0 },
  hills: { value: HILLS },
  hillHeight: { value: HILL_HEIGHT },
  ripples: { value: RIPPLES },
  rippleHeight: { value: RIPPLE_HEIGHT },
  blossoms: { value: BLOSSOMS },
  shine: { value: SHINE },
  ground: { value: GROUND_COLORS.map(color) },
  blossom: { value: BLOSSOM_COLORS.map(color) },
  fogColor: { value: color(FOG_COLOR) },
  fog: { value: FOG },
};

const noise = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    vec3 ns = 0.142857142857 * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: `
    uniform float time, hills, hillHeight, ripples, rippleHeight;
    varying vec3 vWorld;
    varying vec3 vNormal;
    varying float vHeight;
    ${noise}
    float terrain(vec2 p) {
      vec2 warp = vec2(snoise(vec3(p * hills * 0.5, time * 0.3)), snoise(vec3(p * hills * 0.5 + 7.3, time * 0.3)));
      float h = snoise(vec3((p + warp * 3.0) * hills, time * 0.5)) * hillHeight;
      h += snoise(vec3(p * ripples, time * 1.3)) * rippleHeight;
      return h;
    }
    void main() {
      vec4 world = modelMatrix * vec4(position, 1.0);
      float e = 0.1;
      float h = terrain(world.xz);
      vNormal = normalize(vec3(h - terrain(world.xz + vec2(e, 0.0)), e, h - terrain(world.xz + vec2(0.0, e))));
      world.y += h;
      vHeight = world.y;
      vWorld = world.xyz;
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,
  fragmentShader: `
    uniform float time, blossoms, shine, fog, hillHeight;
    uniform vec3 ground[3];
    uniform vec3 blossom[3];
    uniform vec3 fogColor;
    varying vec3 vWorld;
    varying vec3 vNormal;
    varying float vHeight;
    ${noise}
    void main() {
      vec3 normal = normalize(vNormal);
      float h = clamp(vHeight / (hillHeight * 2.0) + 0.5, 0.0, 1.0);
      vec3 color = mix(ground[0], ground[1], smoothstep(0.1, 0.6, h));
      color = mix(color, ground[2], smoothstep(0.6, 0.95, h));

      float bloom = snoise(vec3(vWorld.xz * blossoms, time * 0.4)) * 0.5 + 0.5;
      float hue = snoise(vec3(vWorld.xz * blossoms * 0.4 + 11.0, time * 0.2)) * 0.5 + 0.5;
      vec3 petal = mix(blossom[0], blossom[2], smoothstep(0.2, 0.8, hue));
      petal = mix(petal, blossom[1], smoothstep(0.65, 0.95, bloom * h));
      color = mix(color, petal, smoothstep(0.3, 0.75, bloom) * smoothstep(0.2, 0.7, h));

      vec3 view = normalize(cameraPosition - vWorld);
      float light = 0.6 + 0.6 * max(dot(normal, normalize(vec3(0.4, 1.0, 0.3))), 0.0);
      float rim = pow(1.0 - max(dot(normal, view), 0.0), 3.0) * shine;
      color = color * light + petal * rim;

      float distance = length(cameraPosition - vWorld);
      color = mix(color, fogColor, 1.0 - exp(-pow(distance * fog, 2.0)));
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});

const surface = new THREE.Mesh(new THREE.PlaneGeometry(80, 80, DETAIL, DETAIL), material);
surface.rotation.x = -Math.PI / 2;
scene.add(surface);

const pointer = new THREE.Vector2();
addEventListener('pointermove', (event) => {
  pointer.set(event.clientX / innerWidth * 2 - 1, event.clientY / innerHeight * 2 - 1);
});
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const steer = new THREE.Vector2();
const started = performance.now();
renderer.setAnimationLoop(() => {
  const time = (performance.now() - started) / 1000;
  uniforms.time.value = time * SPEED;
  steer.lerp(pointer, 0.03);
  const travel = time * FLIGHT_SPEED;
  surface.position.set(Math.round(Math.sin(travel * 0.1) * 6), 0, Math.round(-travel));
  camera.position.set(Math.sin(travel * 0.1) * 6 + steer.x * POINTER_STEER, CAMERA_HEIGHT - steer.y, -travel + 8);
  camera.lookAt(camera.position.x, 0, camera.position.z - 8 / Math.tan(CAMERA_TILT));
  renderer.render(scene, camera);
});

addEventListener('pagehide', () => {
  renderer.setAnimationLoop(null);
  surface.geometry.dispose();
  material.dispose();
  renderer.dispose();
}, { once: true });
