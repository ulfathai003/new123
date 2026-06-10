"use client";

import { Canvas, useFrame, useThree, createPortal } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import pointerState from "../lib/pointerState";
import scrollState from "../lib/scrollState";

/* ════════════════════════════════════════════════════════════
   1 · WATER SIM — height/velocity field, ping-pong FBOs.
   The cursor "splats" energy in; a wave equation propagates it.
   ════════════════════════════════════════════════════════════ */
const simShader = /* glsl */ `
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform float uSplat;      // strength from pointer speed
  uniform vec2 uTexel;
  varying vec2 vUv;

  void main() {
    vec2 d = texture2D(uPrev, vUv).rg; // r = height, g = velocity

    float l = texture2D(uPrev, vUv - vec2(uTexel.x, 0.0)).r;
    float r = texture2D(uPrev, vUv + vec2(uTexel.x, 0.0)).r;
    float b = texture2D(uPrev, vUv - vec2(0.0, uTexel.y)).r;
    float t = texture2D(uPrev, vUv + vec2(0.0, uTexel.y)).r;

    float vel = d.g + (l + r + b + t) * 0.25 - d.r;
    vel *= 0.986;                      // damping — long, liquid decay
    float h = (d.r + vel) * 0.998;

    // pointer splat — gaussian drop where the cursor moves
    float dist = distance(vUv, uMouse);
    h += uSplat * exp(-dist * dist * 900.0);

    gl_FragColor = vec4(h, vel, 0.0, 1.0);
  }
`;

const quadVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/* ════════════════════════════════════════════════════════════
   2 · COMPOSITE — refract the particle scene through the water,
   add a specular glint along wave crests. Renders to screen.
   ════════════════════════════════════════════════════════════ */
const compositeShader = /* glsl */ `
  uniform sampler2D uScene;
  uniform sampler2D uWater;
  uniform vec3 uTint;
  varying vec2 vUv;

  void main() {
    float hx = texture2D(uWater, vUv + vec2(0.004, 0.0)).r
             - texture2D(uWater, vUv - vec2(0.004, 0.0)).r;
    float hy = texture2D(uWater, vUv + vec2(0.0, 0.004)).r
             - texture2D(uWater, vUv - vec2(0.0, 0.004)).r;
    vec2 grad = vec2(hx, hy);

    // liquid refraction of everything behind the cursor's wake
    vec3 col = texture2D(uScene, vUv + grad * 0.55).rgb;

    // crest glint — a faint, theme-tinted shimmer
    float spec = pow(max(0.0, hx * 2.2 + hy * 1.2), 2.0) * 4.0;
    col += uTint * spec;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ════════════════════════════════════════════════════════════
   3 · PARTICLES — a drifting intelligence field. Curl-ish motion
   in the vertex stage, soft additive sprites, mouse repulsion.
   ════════════════════════════════════════════════════════════ */
const particleVert = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // scroll 0..1 — drives the scene morph
  uniform float uMorph;      // 1 = full scene journey (home), 0 = calm nebula
  uniform float uEnergy;     // per-route mood
  uniform vec2 uMouseWorld;
  uniform float uPixelRatio;
  attribute vec4 aSeed;      // xyz = scattered seed, w = random
  varying float vMix;
  varying float vFade;
  varying float vGlow;

  void main() {
    vec3 seed = aSeed.xyz;
    float rnd = aSeed.w;
    float r = length(seed);
    vec3 dir = seed / max(r, 0.001);

    /* ── ten-scene formation atlas ──
       the cloud of raw data condenses into intelligence, structures
       into a network, ignites into a core, scatters into civilisation,
       streams down the transformation highway, then launches outward. */
    vec3 cloud  = seed;                                   // 1 · the void of data
    vec3 birth  = dir * (2.0 + rnd * 2.4);                // 2 · convergence
    vec3 lattice = floor(seed / 3.1) * 3.1                // 3 · neural network
                 + vec3(sin(rnd*40.0), cos(rnd*30.0), sin(rnd*22.0)) * 0.5;
    vec3 core   = dir * (5.4 + rnd * 0.7);                // 4 · the core (shell)
    float ga = rnd * 28.0 + r * 0.35;
    float gr = 3.5 + rnd * 12.0;
    vec3 galaxy = vec3(cos(ga) * gr, sin(ga) * gr * 0.42, (rnd - 0.5) * 5.0); // 5+7
    vec3 stream = vec3(cos(rnd * 6.2831) * (1.4 + rnd * 2.2),
                       sin(rnd * 6.2831) * (1.4 + rnd * 2.2),
                       (rnd - 0.5) * 72.0);               // 6 · highway
    vec3 wide   = vec3(cos(ga) * gr * 1.7, sin(ga) * gr * 1.7 * 0.5, (rnd - 0.5) * 9.0); // 8/9
    vec3 launch = dir * (12.0 + rnd * 28.0);              // 10 · launch outward

    // home scrubs the real journey; sub-pages park in a calm galaxy
    float p = mix(0.56, uProgress, uMorph);

    vec3 pos = cloud;
    pos = mix(pos, birth,   smoothstep(0.04, 0.18, p));
    pos = mix(pos, lattice, smoothstep(0.18, 0.32, p));
    pos = mix(pos, core,    smoothstep(0.32, 0.46, p));
    pos = mix(pos, galaxy,  smoothstep(0.46, 0.62, p));
    pos = mix(pos, stream,  smoothstep(0.62, 0.76, p));
    pos = mix(pos, wide,    smoothstep(0.76, 0.90, p));
    pos = mix(pos, launch,  smoothstep(0.90, 1.0,  p));

    // breathing drift — nothing is ever perfectly still
    float t = uTime * (0.1 + rnd * 0.14) * uEnergy;
    pos += vec3(sin(t + rnd * 6.28), cos(t * 0.8 + rnd * 12.5), sin(t * 0.6 + rnd * 3.14))
         * (0.45 + rnd * 0.55);

    // pointer repulsion — particles part around the cursor like water
    vec2 toMouse = pos.xy - uMouseWorld;
    float md = length(toMouse);
    pos.xy += normalize(toMouse + 0.0001) * smoothstep(4.5, 0.0, md) * 2.4;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = (0.9 + rnd * 2.4) * (34.0 / -mv.z);
    gl_PointSize = size * uPixelRatio * (1.0 + sin(uTime * (0.5 + rnd) + rnd * 40.0) * 0.3);

    vMix = rnd;
    vFade = smoothstep(-40.0, -4.0, mv.z);
    // intelligence ignites: a warm surge through the core scene
    vGlow = smoothstep(0.32, 0.46, p) * (1.0 - smoothstep(0.46, 0.60, p));
  }
`;

const particleFrag = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vMix;
  varying float vFade;
  varying float vGlow;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.04, d);
    vec3 col = mix(uColorA, uColorB, vMix);
    // the core scene ignites particles into warm white intelligence
    col = mix(col, vec3(1.0, 0.82, 0.52), vGlow * 0.75);
    gl_FragColor = vec4(col, core * (0.5 + vMix * 0.5) * vFade);
  }
`;

function Particles({ theme, count }) {
  const matRef = useRef();
  const { viewport } = useThree();

  const seeds = useMemo(() => {
    const arr = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      arr[i * 4] = (Math.random() - 0.5) * 44;
      arr[i * 4 + 1] = (Math.random() - 0.5) * 26;
      arr[i * 4 + 2] = -Math.random() * 22;
      arr[i * 4 + 3] = Math.random();
    }
    return arr;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMorph: { value: 1 },
      uEnergy: { value: 1 },
      uMouseWorld: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: 1 },
      uColorA: { value: new THREE.Color("#5ee6ff") },
      uColorB: { value: new THREE.Color("#7c6cff") },
    }),
    []
  );

  useFrame((state) => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    // ease progress so the morph never snaps even on fast scroll
    u.uProgress.value += (scrollState.progress - u.uProgress.value) * 0.08;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    // ease theme colors / morph so route changes feel like weather, not a cut
    u.uColorA.value.lerp(theme.current.a, 0.04);
    u.uColorB.value.lerp(theme.current.b, 0.04);
    u.uEnergy.value += (theme.current.energy - u.uEnergy.value) * 0.04;
    u.uMorph.value += ((theme.current.morph ?? 1) - u.uMorph.value) * 0.05;
    // pointer 0..1 → world units on the z=0 plane
    u.uMouseWorld.value.set(
      (pointerState.x - 0.5) * viewport.width,
      (pointerState.y - 0.5) * viewport.height
    );
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(count * 3), 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 4]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ════════════════════════════════════════════════════════════
   4 · PIPELINE — particles → FBO, water sim → ping-pong,
   composite → screen. One orchestrator owns the render loop.
   ════════════════════════════════════════════════════════════ */
const SIM_SIZE = 288;

function Pipeline({ theme, count }) {
  const { gl, camera, size } = useThree();

  const sceneFBO = useFBO(size.width, size.height, { samples: 0 });
  const simA = useFBO(SIM_SIZE, SIM_SIZE, { type: THREE.HalfFloatType, depth: false });
  const simB = useFBO(SIM_SIZE, SIM_SIZE, { type: THREE.HalfFloatType, depth: false });
  const flip = useRef(false);

  const particleScene = useMemo(() => {
    const s = new THREE.Scene();
    s.background = new THREE.Color("#060606");
    return s;
  }, []);

  const [simScene, simCam, simMat] = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: simShader,
      uniforms: {
        uPrev: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uSplat: { value: 0 },
        uTexel: { value: new THREE.Vector2(1 / SIM_SIZE, 1 / SIM_SIZE) },
      },
    });
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    return [scene, new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), mat];
  }, []);

  const [outScene, outMat] = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: compositeShader,
      uniforms: {
        uScene: { value: null },
        uWater: { value: null },
        uTint: { value: new THREE.Color("#5ee6ff") },
      },
    });
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    return [scene, mat];
  }, []);

  useFrame(() => {
    // 0 · depth parallax — the camera leans toward the cursor, so the
    // particle field's z-layers slide over each other like a diorama
    const px = (pointerState.x - 0.5) * 2.4;
    const py = (pointerState.y - 0.5) * 1.6;
    camera.position.x += (px - camera.position.x) * 0.045;
    camera.position.y += (py - camera.position.y) * 0.045;
    camera.lookAt(0, 0, -10);

    // 1 · water step (splat strength follows pointer speed, clicks slam)
    const splat =
      Math.min(pointerState.speed * 0.0016, 0.22) + (pointerState.clicks > 0 ? 0.5 : 0);
    pointerState.clicks = 0;
    const prev = flip.current ? simB : simA;
    const next = flip.current ? simA : simB;
    simMat.uniforms.uPrev.value = prev.texture;
    simMat.uniforms.uMouse.value.set(pointerState.x, pointerState.y);
    simMat.uniforms.uSplat.value = pointerState.active ? splat : 0;
    gl.setRenderTarget(next);
    gl.render(simScene, simCam);
    flip.current = !flip.current;

    // 2 · particles into the scene buffer
    gl.setRenderTarget(sceneFBO);
    gl.render(particleScene, camera);

    // 3 · composite to screen, refracted through the water
    outMat.uniforms.uScene.value = sceneFBO.texture;
    outMat.uniforms.uWater.value = next.texture;
    outMat.uniforms.uTint.value.lerp(theme.current.a, 0.04);
    gl.setRenderTarget(null);
    gl.render(outScene, simCam);
  }, 1);

  return createPortal(<Particles theme={theme} count={count} />, particleScene);
}

/* ─── Root ─── */
export default function GLBackground({ theme, reducedMotion = false }) {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 14000;
    return window.innerWidth < 768 ? 4000 : 14000;
  }, []);

  if (reducedMotion) {
    // calm gradient, zero GPU churn
    return (
      <div
        className="fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, #0b1016 0%, #060606 70%)",
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ fov: 50, near: 0.1, far: 120, position: [0, 0, 16] }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Pipeline theme={theme} count={count} />
      </Canvas>
    </div>
  );
}
