"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { FRAGMENT, VERTEX } from "./shader";

type Tier = { pixels: number; steps: number };

// Pixel budget and integration steps per quality tier. The disk is soft, so a
// reduced internal resolution upscaled by the browser is indistinguishable
// from native — and an order of magnitude cheaper.
const TIERS: Tier[] = [
  { pixels: 620_000, steps: 160 },
  { pixels: 380_000, steps: 130 },
  { pixels: 220_000, steps: 110 },
  { pixels: 130_000, steps: 90 },
];

const FRAME_MS = 1000 / 30; // a slow, calm disk needs no more than 30 fps

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("[BlackHole] shader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/**
 * A ray-traced black hole (see ./shader.ts), rendered with WebGL2.
 *
 * Cost control, because it sits in the hero of every visit:
 * - internal resolution is capped by a pixel budget, and steps down a tier
 *   whenever frames run long;
 * - it renders at most 30 fps, and not at all when off-screen or the tab is
 *   hidden;
 * - with reduced motion it draws one composed frame and stops;
 * - without WebGL2, or if the context is lost, it falls back to a static
 *   rendering so the hero never shows an empty box.
 */
export default function BlackHole({
  className,
  interactive = true,
  label = "A black hole bending light from its accretion disk over and under its shadow",
}: {
  className?: string;
  interactive?: boolean;
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dev = process.env.NODE_ENV === "development";
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      // Lets the dev harness read frames back for visual checks.
      preserveDrawingBuffer: dev,
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("[BlackHole] link:", gl.getProgramInfoLog(prog));
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    // One oversized triangle covers the viewport with no seam down the middle.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uLook = gl.getUniformLocation(prog, "uLook");
    const uSteps = gl.getUniformLocation(prog, "uSteps");

    const narrow = window.innerWidth < 768;
    let tier = narrow ? 2 : 0;
    let cssW = 0;
    let cssH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const budget = TIERS[tier].pixels;
      const scale = Math.min(dpr, Math.sqrt(budget / (cssW * cssH)));
      canvas.width = Math.max(1, Math.floor(cssW * scale));
      canvas.height = Math.max(1, Math.floor(cssH * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    let lookX = 0;
    let lookY = 0;
    let targetX = 0;
    let targetY = 0;
    const start = performance.now();
    // A fixed moment for the reduced-motion still, chosen for a pleasing disk.
    const STILL_T = 37;

    const draw = (t: number) => {
      lookX += (targetX - lookX) * 0.06;
      lookY += (targetY - lookY) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uLook, lookX, lookY);
      gl.uniform1f(uSteps, TIERS[tier].steps);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // First frame synchronously, so the hero is never an empty box.
    draw(reduced ? STILL_T : 0);
    setReady(true);

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const allowPointer = interactive && !coarse && !reduced;
    if (allowPointer) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = false;
    let last = 0;
    let slowFrames = 0;

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS - 2) return; // tolerance: every 2nd vsync at 60 Hz
      const spent = now - last;
      last = now;

      // Frames arriving far later than budgeted mean the GPU is struggling:
      // step down a quality tier rather than stutter.
      if (spent > FRAME_MS * 2.2) {
        slowFrames += 1;
        if (slowFrames > 8 && tier < TIERS.length - 1) {
          tier += 1;
          slowFrames = 0;
          resize();
        }
      } else {
        slowFrames = Math.max(0, slowFrames - 1);
      }
      draw((now - start) / 1000);
    };

    const play = () => {
      if (running || reduced) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Two signals gate one loop: render only when on screen AND the tab is
    // visible. Returning to the tab must not restart a canvas scrolled away.
    let onScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) play();
        else pause();
      },
      { rootMargin: "100px" },
    );
    io.observe(canvas);
    const onVis = () => (document.hidden || !onScreen ? pause() : play());
    document.addEventListener("visibilitychange", onVis);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(reduced ? STILL_T : (performance.now() - start) / 1000);
    });
    ro.observe(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      pause();
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    if (dev) {
      (window as unknown as { __blackHole?: object }).__blackHole = {
        frame: (t = STILL_T) => {
          draw(t);
          return canvas.toDataURL("image/jpeg", 0.85);
        },
        info: () => ({ w: canvas.width, h: canvas.height, tier, steps: TIERS[tier].steps }),
      };
    }

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (allowPointer) window.removeEventListener("pointermove", onPointer);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reduced, interactive]);

  if (failed) return <BlackHoleFallback className={className} label={label} />;

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={cn(
        "block h-full w-full transition-opacity duration-[1200ms] ease-[var(--ease-out-expo)]",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}

/** Static stand-in for devices without WebGL2: shadow, photon ring, disk. */
function BlackHoleFallback({ className, label }: { className?: string; label: string }) {
  return (
    <svg viewBox="0 0 800 500" role="img" aria-label={label} className={cn("block h-full w-full", className)}>
      <defs>
        <radialGradient id="bhf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bhf-disk" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--color-violet)" stopOpacity="0" />
          <stop offset="30%" stopColor="var(--color-signal-pale)" stopOpacity="0.9" />
          <stop offset="70%" stopColor="var(--color-signal)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--color-violet)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="400" cy="250" rx="300" ry="190" fill="url(#bhf-glow)" />
      <ellipse cx="400" cy="250" rx="330" ry="26" fill="none" stroke="url(#bhf-disk)" strokeWidth="14" />
      <circle cx="400" cy="250" r="86" fill="none" stroke="var(--color-signal-pale)" strokeOpacity="0.55" strokeWidth="3" />
      <circle cx="400" cy="250" r="80" fill="var(--color-void)" />
    </svg>
  );
}
