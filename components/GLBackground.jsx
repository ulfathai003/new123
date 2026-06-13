"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import pointerState from "../lib/pointerState";
import scrollState from "../lib/scrollState";

const PAPER = "#f3f1ec";
const ALPS_URL = "https://lumalabs.ai/capture/4da7cf32-865a-4515-8cb9-9dfc574c90c2";

/* the storyboard: camera shots the scroll flies between (igloo-style).
   each shot is [position, lookAt] in world units around the massif. */
const SHOTS = [
  [[0, 1.5, 16], [0, 1.0, -6]],   // 0 · arrival — frontal, eye level
  [[7, 4.5, 12], [-1, 0.5, -5]],  // 1 · starboard climb — high right
  [[-8, 2.0, 10], [1, 1.5, -4]],  // 2 · port traverse — low left
  [[4, 8.0, 9], [0, -1.5, -5]],   // 3 · aerial — looking down the ridges
  [[-3, 0.6, 7.5], [1, 2.5, -4]], // 4 · valley floor — peaks loom overhead
  [[0, 5.5, 18], [0, 0.5, -6]],   // 5 · departure — wide farewell
];
const vA = new THREE.Vector3();
const vB = new THREE.Vector3();
const lookTarget = new THREE.Vector3(0, 1, -6);

/* ════════════════════════════════════════════════════════════
   ALPS SPLAT — the photoreal centrepiece, rendered DIRECTLY to
   the canvas (Luma's own render hooks need the default loop; a
   manual FBO pipeline was what made it render black). Obeys the
   visitor's mouse-hold grip via pointerState.hold.
   ════════════════════════════════════════════════════════════ */
function AlpsSplat({ onReady }) {
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
          // keep three integration so scene fog blends the peaks into paper
          enableThreeShaderIntegration: true,
        });
        instance.semanticsMask = LumaSplatsSemantics.FOREGROUND;
        instance.onLoad = () => onReady?.();
        setSplat(instance);
      })
      .catch((err) => console.error("[gl] luma splat failed to load:", err));
    return () => {
      live = false;
      instance?.dispose?.();
    };
  }, [onReady]);

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

/* ════════════════════════════════════════════════════════════
   PARTICLE ATMOSPHERE — always present. It is the moving backdrop
   on inner pages AND the guaranteed fallback if the splat is slow
   or unavailable, so the scene is never a blank page.
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
    float ga = rnd * 28.0 + uTime * (0.02 + rnd * 0.05) * uEnergy;
    float gr = 3.0 + rnd * 12.0;
    vec3 pos = vec3(cos(ga) * gr, sin(ga) * gr * 0.5, (rnd - 0.5) * 7.0 - 3.0);
    pos += vec3(sin(uTime * 0.4 + rnd * 6.28), cos(uTime * 0.3 + rnd * 12.5), 0.0) * (0.3 + rnd * 0.4);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = (0.9 + rnd * 2.2) * (30.0 / -mv.z);
    gl_PointSize = size * uPixelRatio * (1.0 + sin(uTime * (0.5 + rnd) + rnd * 40.0) * 0.3);
    vMix = rnd;
    vFade = smoothstep(-40.0, -4.0, mv.z);
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
    col = mix(col, col * 0.35, 0.55);     // ink-bodied so they read on paper
    gl_FragColor = vec4(col, core * (0.3 + vMix * 0.3) * vFade);
  }
`;

function Particles({ theme, count, dim }) {
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
        opacity={dim ? 0.5 : 1}
      />
    </points>
  );
}

/* ════════════════════════════════════════════════════════════
   CAMERA RIG — scroll flies the camera through the shots; the
   cursor adds a parallax lean; hold-orbit inertia is integrated
   here once per frame (scene objects read pointerState.hold).
   ════════════════════════════════════════════════════════════ */
function CameraRig({ mode }) {
  const { camera } = useThree();
  useFrame(() => {
    if (mode === "splat") {
      const t = scrollState.progress * (SHOTS.length - 1);
      const i = Math.min(Math.floor(t), SHOTS.length - 2);
      const f = t - i;
      const e = f * f * (3 - 2 * f);
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

    // mouse-hold orbit inertia (scene objects rotate by hold.*)
    const hold = pointerState.hold;
    if (!hold.dragging) {
      hold.yaw += hold.vYaw;
      hold.pitch += hold.vPitch;
      hold.vYaw *= 0.94;
      hold.vPitch *= 0.94;
    }
    hold.pitch = THREE.MathUtils.clamp(hold.pitch, -0.35, 0.45);
  });
  return null;
}

function Scene({ theme, mode, count }) {
  const [splatReady, setSplatReady] = useState(false);
  const onReady = useMemo(() => () => setSplatReady(true), []);
  return (
    <>
      <CameraRig mode={mode} />
      {mode === "splat" && <AlpsSplat onReady={onReady} />}
      {/* atmosphere always on; thinned once the splat has arrived */}
      <Particles theme={theme} count={count} dim={mode === "splat" && splatReady} />
    </>
  );
}

/* ─── Root ─── */
export default function GLBackground({ theme, mode = "calm", reducedMotion = false }) {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 2600;
    return window.innerWidth < 768 ? 1200 : 2600;
  }, []);

  // phones don't stream a multi-million-splat mountain — particle field only
  const effectiveMode = useMemo(() => {
    if (typeof window === "undefined") return mode;
    return mode === "splat" && window.innerWidth < 768 ? "particles" : mode;
  }, [mode]);

  /* mouse-hold orbit: press anywhere quiet and drag to turn the world;
     release and it coasts. Mouse only — touch keeps scroll/camera. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches || reducedMotion) return;
    let lastX = 0, lastY = 0;
    const hold = pointerState.hold;
    const onDown = (e) => {
      if (e.button !== 0) return;
      if (e.target.closest("a, button, input, textarea, select, summary, [data-magnetic], pre")) return;
      hold.dragging = true; hold.vYaw = 0; hold.vPitch = 0;
      lastX = e.clientX; lastY = e.clientY;
      document.documentElement.classList.add("is-grabbing");
    };
    const onMove = (e) => {
      if (!hold.dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      hold.yaw += dx * 0.0042; hold.pitch += dy * 0.0026;
      hold.vYaw = dx * 0.0042; hold.vPitch = dy * 0.0026;
    };
    const onUp = () => { hold.dragging = false; document.documentElement.classList.remove("is-grabbing"); };
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
        style={{ background: "radial-gradient(70% 60% at 50% 35%, #ffffff 0%, #f3f1ec 60%, #e9e6df 100%)" }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ fov: 50, near: 0.1, far: 200, position: [0, 1.5, 16] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(PAPER, 1);
          scene.background = new THREE.Color(PAPER);
          scene.fog = new THREE.FogExp2(PAPER, 0.05);
        }}
      >
        <Scene theme={theme} mode={effectiveMode} count={count} />
      </Canvas>
    </div>
  );
}
