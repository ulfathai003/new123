/**
 * Shared mutable pointer state — written by the Cursor component,
 * read every frame by WebGL (ripple sim, particle repulsion).
 * Plain module object: no React re-renders at pointer speed.
 */
const pointerState = {
  /** normalized 0..1, y flipped for GL (0 = bottom) */
  x: 0.5,
  y: 0.5,
  /** px/frame speed, for splat strength */
  speed: 0,
  /** true while pointer is over the window */
  active: false,
  /** incremented on click — GL reads & consumes for burst splats */
  clicks: 0,
};

export default pointerState;
