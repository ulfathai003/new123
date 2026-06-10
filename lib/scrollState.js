/**
 * Shared mutable scroll state — the bridge between the DOM scroll world
 * (Lenis / ScrollTrigger) and the WebGL world (read every frame in useFrame).
 * A plain module object avoids React re-renders at 60fps.
 */
const scrollState = {
  /** 0 → 1 across the whole document */
  progress: 0,
  /** Lenis scroll velocity, for subtle camera shake/drag */
  velocity: 0,
  /** set true once the preloader finishes */
  ready: false,
};

export default scrollState;
