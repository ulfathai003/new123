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

    // chromatic aberration along the wave gradient — lensy, cinematic
    vec3 col;
    col.r = texture2D(uScene, vUv + grad * 0.62).r;
    col.g = texture2D(uScene, vUv + grad * 0.55).g;
    col.b = texture2D(uScene, vUv + grad * 0.46).b;

    float crest = pow(max(0.0, hx * 2.2 + hy * 1.2), 2.0);
    float trough = pow(max(0.0, -(hx * 2.2 + hy * 1.2)), 2.0);
    col = mix(col, uTint, clamp(trough * 1.6, 0.0, 0.4));
    col -= crest * 0.18;

    // gentle photographic vignette, tuned for the paper page
    vec2 vc = vUv - 0.5;
    col *= 1.0 - dot(vc, vc) * 0.22;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ════════════════════════════════════════════════════════════
   3 · ALPS SPLAT — the photoreal centrepiece (home only).
   A Luma gaussian splat of the Schwyz Alps, foreground-masked
   so the peaks float on paper, scroll-orbited like igloo.inc.
   ════════════════════════════════════════════════════════════ */
import { useGLTF } from "@react-three/drei";

const ALPS_URL = "https://lumalabs.ai/capture/4da7cf32-865a-4515-8cb9-9dfc574c90c2";
const MOUNTAIN_GLB = "/models/mountain.glb";

/* ─── OPTION A: The Luma Gaussian Splat (Cinematic, Streamed) ─── */
function AlpsSplat() {
  const groupRef = useRef();
  const [splat, setSplat] = useState(null);

  useEffect(() => {
    let live = true;
    let instance = null;
    import("@lumaai/luma-web")
      .then(({ LumaSplatsThree, LumaSplatsSemantics }) => {
        if (!live) return;
        instance = new LumaSplatsThree({
          source: ALPS_URL,
          particleRevealEnabled: true,
          enableThreeShaderIntegration: true,
        });
        instance.semanticsMask = LumaSplatsSemantics.FOREGROUND;
        setSplat(instance);
        console.log("[gl] alps splat initialised");
      })
      .catch((err) => console.error("[gl] luma splat failed to load:", err));
    return () => {
      live = false;
      instance?.dispose?.();
    };
  }, []);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const hold = pointerState.hold;
    g.rotation.y += (state.clock.elapsedTime * 0.008 + hold.yaw - g.rotation.y) * 0.12;
    g.rotation.x += (hold.pitch - g.rotation.x) * 0.12;
    g.position.y = -3.2 + Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
  });

  if (!splat) return null;
  return (
    <group ref={groupRef} position={[0, -3.2, 4]} scale={2.6}>
      <primitive object={splat} />
    </group>
  );
}

/* ─── OPTION B: The Self-Hosted GLB (Reliable, Local) ─── */
function AlpsGLB() {
  const groupRef = useRef();
  // Falling back to a known placeholder if the user hasn't uploaded their mountain.glb yet
  const { scene } = useGLTF(MOUNTAIN_GLB, true);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const hold = pointerState.hold;
    g.rotation.y += (state.clock.elapsedTime * 0.008 + hold.yaw - g.rotation.y) * 0.12;
    g.rotation.x += (hold.pitch - g.rotation.x) * 0.12;
    g.position.y = -3.2 + Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
  });

  return (
    <group ref={groupRef} position={[0, -3.2, 4]} scale={2.6}>
      <primitive object={scene} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
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
  const ptsRef = useRef();

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
    // the swarm also yields to the visitor's grip
    if (ptsRef.current) {
      ptsRef.current.rotation.y += (pointerState.hold.yaw - ptsRef.current.rotation.y) * 0.12;
      ptsRef.current.rotation.x += (pointerState.hold.pitch * 0.6 - ptsRef.current.rotation.x) * 0.12;
    }
  });

  return (
    <points ref={ptsRef} frustumCulled={false}>
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

/* the storyboard: camera shots the scroll flies between (igloo-style).
   Each shot is [position, lookAt] in world units around the massif. */
const SHOTS = [
  [[0, 1.5, 16], [0, 1.0, -6]],   // 0 · arrival — frontal, eye level
  [[7, 4.5, 12], [-1, 0.5, -5]],  // 1 · starboard climb — high right
  [[-8, 2.0, 10], [1, 1.5, -4]],  // 2 · port traverse — low left
  [[4, 8.0, 9],  [0, -1.5, -5]],  // 3 · aerial — looking down the ridges
  [[-3, 0.6, 7.5], [1, 2.5, -4]], // 4 · valley floor — peaks loom overhead
  [[0, 5.5, 18], [0, 0.5, -6]],   // 5 · departure — wide farewell
];
const vA = new THREE.Vector3();
const vB = new THREE.Vector3();
const lookTarget = new THREE.Vector3(0, 1, -6);

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
    // ── cinematic flythrough: scroll interpolates between storyboard
    // shots; the cursor adds a small parallax lean on top ──
    if (mode === "splat") {
      const t = scrollState.progress * (SHOTS.length - 1);
      const i = Math.min(Math.floor(t), SHOTS.length - 2);
      const f = t - i;
      const e = f * f * (3 - 2 * f); // smoothstep between shots
      vA.fromArray(SHOTS[i][0]).lerp(vB.fromArray(SHOTS[i + 1][0]), e);
      vA.x += (pointerState.x - 0.5) * 1.4;
      vA.y += (pointerState.y - 0.5) * 0.9;
      camera.position.lerp(vA, 0.05);
      vA.fromArray(SHOTS[i][1]).lerp(vB.fromArray(SHOTS[i + 1][1]), e);
      lookTarget.lerp(vA, 0.05);
    } else {
      vA.set((pointerState.x - 0.5) * 1.6, (pointerState.y - 0.5) * 1.0, 16);
      camera.position.lerp(vA, 0.04);
      lookTarget.lerp(vB.set(0, 0, -6), 0.04);
    }
    camera.lookAt(lookTarget);

    // ── mouse-hold orbit: integrate inertia; content reads hold.* ──
    const hold = pointerState.hold;
    if (!hold.dragging) {
      hold.yaw += hold.vYaw;
      hold.pitch += hold.vPitch;
      hold.vYaw *= 0.94;
      hold.vPitch *= 0.94;
    }
    hold.pitch = THREE.MathUtils.clamp(hold.pitch, -0.35, 0.45);

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
      {mode === "splat" && <AlpsGLB />}
      {mode === "particles" && <Particles theme={theme} count={count} />}
    </>,
    contentScene
  );
}

/* ─── Root ─── */
export default function GLBackground({ theme, mode = "calm", reducedMotion = false }) {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 3500;
    return window.innerWidth < 768 ? 1200 : 3500;
  }, []);

  // phones don't stream a multi-million-splat mountain — they get the
  // light particle field instead, same mood at a fraction of the cost
  const effectiveMode = useMemo(() => {
    if (typeof window === "undefined") return mode;
    return mode === "splat" && window.innerWidth < 768 ? "particles" : mode;
  }, [mode]);

  /* ── mouse-hold orbit: press anywhere quiet and drag to turn the
     world; release and it coasts. Mouse only — touch keeps scrolling,
     which already flies the camera. ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches || reducedMotion) return;

    let lastX = 0;
    let lastY = 0;
    const hold = pointerState.hold;

    const onDown = (e) => {
      if (e.button !== 0) return;
      if (e.target.closest("a, button, input, textarea, select, summary, [data-magnetic], pre")) return;
      hold.dragging = true;
      hold.vYaw = 0;
      hold.vPitch = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      document.documentElement.classList.add("is-grabbing");
    };
    const onMove = (e) => {
      if (!hold.dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      hold.yaw += dx * 0.0042;
      hold.pitch += dy * 0.0026;
      hold.vYaw = dx * 0.0042; // remembered for release inertia
      hold.vPitch = dy * 0.0026;
    };
    const onUp = () => {
      hold.dragging = false;
      document.documentElement.classList.remove("is-grabbing");
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      onUp();
    };
  }, [reducedMotion]);

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
        <Pipeline theme={theme} mode={effectiveMode} count={count} />
      </Canvas>
    </div>
  );
}
