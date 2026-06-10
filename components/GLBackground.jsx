"use client";

import { Canvas, useFrame, useThree, createPortal } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import pointerState from "../lib/pointerState";
import scrollState from "../lib/scrollState";

const PAPER = "#f3f1ec";

/* ════════════════════════════════════════════════════════════
   1 · WATER SIM — height/velocity field, ping-pong FBOs.
   The cursor splats energy in; a wave equation propagates it.
   This is the ONLY pointer effect — no particle repulsion.
   ════════════════════════════════════════════════════════════ */
const simShader = /* glsl */ `
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform float uSplat;
  uniform vec2 uTexel;
  varying vec2 vUv;

  void main() {
    vec2 d = texture2D(uPrev, vUv).rg; // r = height, g = velocity

    float l = texture2D(uPrev, vUv - vec2(uTexel.x, 0.0)).r;
    float r = texture2D(uPrev, vUv + vec2(uTexel.x, 0.0)).r;
    float b = texture2D(uPrev, vUv - vec2(0.0, uTexel.y)).r;
    float t = texture2D(uPrev, vUv + vec2(0.0, uTexel.y)).r;

    float vel = d.g + (l + r + b + t) * 0.25 - d.r;
    vel *= 0.986;
    float h = (d.r + vel) * 0.998;

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
   2 · COMPOSITE — refract the scene through the water wake.
   On paper, troughs pick up a faint tint and crests darken —
   like ripples on shallow water over white stone.
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

    vec3 col = texture2D(uScene, vUv + grad * 0.55).rgb;

    float crest = pow(max(0.0, hx * 2.2 + hy * 1.2), 2.0);
    float trough = pow(max(0.0, -(hx * 2.2 + hy * 1.2)), 2.0);
    col = mix(col, uTint, clamp(trough * 1.6, 0.0, 0.4));
    col -= crest * 0.18;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ════════════════════════════════════════════════════════════
   3 · ALPS SPLAT — the photoreal centrepiece (home only).
   A Luma gaussian splat of the Schwyz Alps, foreground-masked
   so the peaks float on paper, scroll-orbited like igloo.inc.
   ════════════════════════════════════════════════════════════ */
const ALPS_URL = "https://lumalabs.ai/capture/4da7cf32-865a-4515-8cb9-9dfc574c90c2";

function AlpsSplat() {
  const groupRef = useRef();
  const [splat, setSplat] = useState(null);

  useEffect(() => {
    let live = true;
    let instance = null;
    // dynamic import: luma-web touches WebGL internals, keep it client-only
    import("@lumaai/luma-web").then(({ LumaSplatsThree, LumaSplatsSemantics }) => {
      if (!live) return;
      instance = new LumaSplatsThree({
        source: ALPS_URL,
        particleRevealEnabled: true,
        enableThreeShaderIntegration: true,
      });
      // strip the captured sky — the peaks float on the paper page
      instance.semanticsMask = LumaSplatsSemantics.FOREGROUND;
      setSplat(instance);
    });
    return () => {
      live = false;
      instance?.dispose?.();
    };
  }, []);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const p = scrollState.progress;
    // the mountain slowly presents itself as the story scrolls
    g.rotation.y = p * Math.PI * 0.55 + state.clock.elapsedTime * 0.012;
    g.position.y = -3.2 + Math.sin(state.clock.elapsedTime * 0.18) * 0.12 - p * 1.4;
  });

  if (!splat) return null;
  return (
    <group ref={groupRef} position={[0, -3.2, 4]} scale={2.6}>
      <primitive object={splat} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════════
   4 · PARTICLES — kept ONLY for the AI Agents page, where a
   living swarm is the point. No cursor repulsion anywhere.
   ════════════════════════════════════════════════════════════ */
const particleVert = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uPixelRatio;
  attribute vec4 aSeed;
  varying float vMix;
  varying float vFade;

  void main() {
    vec3 seed = aSeed.xyz;
    float rnd = aSeed.w;

    // calm orbital galaxy — the agent fleet at work
    float ga = rnd * 28.0 + uTime * (0.02 + rnd * 0.05) * uEnergy;
    float gr = 3.0 + rnd * 11.0;
    vec3 pos = vec3(cos(ga) * gr, sin(ga) * gr * 0.45, (rnd - 0.5) * 6.0 - 4.0);
    pos += vec3(sin(uTime * 0.4 + rnd * 6.28), cos(uTime * 0.3 + rnd * 12.5), 0.0)
         * (0.3 + rnd * 0.4);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = (0.9 + rnd * 2.2) * (30.0 / -mv.z);
    gl_PointSize = size * uPixelRatio * (1.0 + sin(uTime * (0.5 + rnd) + rnd * 40.0) * 0.3);

    vMix = rnd;
    vFade = smoothstep(-34.0, -4.0, mv.z);
  }
`;

const particleFrag = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vMix;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.04, d);
    vec3 col = mix(uColorA, uColorB, vMix);
    col = mix(col, col * 0.35, 0.55); // ink-bodied so they read on paper
    gl_FragColor = vec4(col, core * (0.32 + vMix * 0.32) * vFade);
  }
`;

function Particles({ theme, count }) {
  const matRef = useRef();

  const seeds = useMemo(() => {
    const arr = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      arr[i * 4] = (Math.random() - 0.5) * 40;
      arr[i * 4 + 1] = (Math.random() - 0.5) * 24;
      arr[i * 4 + 2] = -Math.random() * 20;
      arr[i * 4 + 3] = Math.random();
    }
    return arr;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 1 },
      uPixelRatio: { value: 1 },
      uColorA: { value: new THREE.Color("#5b46e8") },
      uColorB: { value: new THREE.Color("#0bb6d4") },
    }),
    []
  );

  useFrame((state) => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uColorA.value.lerp(theme.current.a, 0.04);
    u.uColorB.value.lerp(theme.current.b, 0.04);
    u.uEnergy.value += (theme.current.energy - u.uEnergy.value) * 0.04;
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
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

/* ════════════════════════════════════════════════════════════
   5 · PIPELINE — content → FBO, water sim → ping-pong,
   composite → screen. One orchestrator owns the render loop.
   ════════════════════════════════════════════════════════════ */
const SIM_SIZE = 288;

function Pipeline({ theme, mode, count }) {
  const { gl, camera, size } = useThree();

  const sceneFBO = useFBO(size.width, size.height, { samples: 0 });
  const simA = useFBO(SIM_SIZE, SIM_SIZE, { type: THREE.HalfFloatType, depth: false });
  const simB = useFBO(SIM_SIZE, SIM_SIZE, { type: THREE.HalfFloatType, depth: false });
  const flip = useRef(false);

  const contentScene = useMemo(() => {
    const s = new THREE.Scene();
    s.background = new THREE.Color(PAPER);
    // distant geometry dissolves into the page — igloo-style float
    s.fog = new THREE.FogExp2(PAPER, 0.055);
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
        uTint: { value: new THREE.Color("#5b46e8") },
      },
    });
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    return [scene, mat];
  }, []);

  useFrame(() => {
    // gentle depth parallax — the camera leans with the cursor,
    // sliding the 3D content against the page like a diorama
    const px = (pointerState.x - 0.5) * 1.6;
    const py = (pointerState.y - 0.5) * 1.0;
    camera.position.x += (px - camera.position.x) * 0.04;
    camera.position.y += (py - camera.position.y) * 0.04;
    // home dollies toward the peaks as the journey progresses
    const targetZ = mode === "splat" ? 16 - scrollState.progress * 5 : 16;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0, -6);

    // water step — splat strength follows pointer speed, clicks slam
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

    // content into the scene buffer
    gl.setRenderTarget(sceneFBO);
    gl.render(contentScene, camera);

    // composite to screen through the water
    outMat.uniforms.uScene.value = sceneFBO.texture;
    outMat.uniforms.uWater.value = next.texture;
    outMat.uniforms.uTint.value.lerp(theme.current.a, 0.04);
    gl.setRenderTarget(null);
    gl.render(outScene, simCam);
  }, 1);

  return createPortal(
    <>
      {mode === "splat" && <AlpsSplat />}
      {mode === "particles" && <Particles theme={theme} count={count} />}
    </>,
    contentScene
  );
}

/* ─── Root ─── */
export default function GLBackground({ theme, mode = "calm", reducedMotion = false }) {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 3500;
    return window.innerWidth < 768 ? 1500 : 3500;
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 35%, #ffffff 0%, #f3f1ec 60%, #e9e6df 100%)",
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ fov: 50, near: 0.1, far: 200, position: [0, 0, 16] }}
        gl={{ antialias: false, powerPreference: "high-performance", preserveDrawingBuffer: true }}
      >
        <Pipeline theme={theme} mode={mode} count={count} />
      </Canvas>
    </div>
  );
}
