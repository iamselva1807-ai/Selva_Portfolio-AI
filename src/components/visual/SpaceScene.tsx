"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/lib/motion";
import { sceneForRoute, type SceneName } from "@/lib/theme";

type Frame = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  /** Milliseconds since the scene started. */
  t: number;
  /** Smoothed pointer offset, -1..1 on each axis. */
  px: number;
  py: number;
  reduced: boolean;
  narrow: boolean;
};

type Scene = {
  /** Built once per resize. Holds the particle arrays. */
  init: (w: number, h: number, narrow: boolean) => unknown;
  draw: (state: never, f: Frame) => void;
};

const CYAN = "126, 220, 240";
const VIOLET = "139, 130, 240";
const WHITE = "235, 240, 248";

/** Deterministic pseudo-random so scenes are stable across re-renders. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const dot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  tint: string,
  a: number,
) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${tint}, ${a.toFixed(3)})`;
  ctx.fill();
};

/* ============================================================
   SPIRAL GALAXY — /work
   Logarithmic arms wound around a luminous core, turning slowly.
   ============================================================ */
type GalaxyPt = { r: number; th: number; size: number; tint: string; a: number };

const spiralGalaxy: Scene = {
  init: (w, h, narrow) => {
    const rand = rng(1337);
    const count = narrow ? 420 : 1100;
    const pts: GalaxyPt[] = [];
    const arms = 2;
    const maxR = Math.min(w, h) * 0.52;
    for (let i = 0; i < count; i++) {
      const arm = i % arms;
      // Bias toward the core so the centre reads bright.
      const t = Math.pow(rand(), 0.62);
      const r = t * maxR;
      // Logarithmic spiral, with scatter that widens outward.
      const spread = 0.16 + t * 0.5;
      const th =
        (arm / arms) * Math.PI * 2 + Math.log(1 + t * 9) * 2.1 + (rand() - 0.5) * spread;
      const roll = rand();
      pts.push({
        r,
        th,
        size: 0.35 + rand() * (t < 0.25 ? 1.2 : 0.8),
        tint: roll > 0.9 ? CYAN : roll > 0.82 ? VIOLET : WHITE,
        a: (1 - t * 0.55) * (0.3 + rand() * 0.5),
      });
    }
    return { pts, maxR };
  },
  draw: (state, f) => {
    const { pts, maxR } = state as unknown as { pts: GalaxyPt[]; maxR: number };
    const { ctx, w, h, t, px, py } = f;
    const cx = w * (f.narrow ? 0.72 : 0.72) + px * 26;
    const cy = h * (f.narrow ? 0.22 : 0.42) + py * 18;
    // Differential rotation: the core turns faster than the rim.
    const spin = f.reduced ? 0 : t * 0.0000085;

    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.42);
    core.addColorStop(0, `rgba(${WHITE}, 0.16)`);
    core.addColorStop(0.35, `rgba(${CYAN}, 0.06)`);
    core.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = core;
    ctx.fillRect(cx - maxR, cy - maxR, maxR * 2, maxR * 2);

    for (const p of pts) {
      const rel = p.r / maxR;
      const th = p.th + spin * (1.8 - rel);
      // Flatten slightly so it reads as a disk at a tilt, not a flat circle.
      const x = cx + Math.cos(th) * p.r;
      const y = cy + Math.sin(th) * p.r * 0.42;
      dot(ctx, x, y, p.size, p.tint, p.a);
    }
  },
};

/* ============================================================
   BLACK HOLE — /work/[slug]
   An accretion disk orbiting a dark centre, inner edge fastest.
   ============================================================ */
type DiskPt = { r: number; th: number; size: number; a: number; tint: string };

const blackHole: Scene = {
  init: (w, h, narrow) => {
    const rand = rng(90210);
    const count = narrow ? 320 : 900;
    const R = Math.min(w, h) * (narrow ? 0.17 : 0.3);
    const pts: DiskPt[] = [];
    for (let i = 0; i < count; i++) {
      const t = Math.pow(rand(), 0.55);
      pts.push({
        r: R * (1 + t * 2.2),
        th: rand() * Math.PI * 2,
        size: 0.35 + rand() * 0.9,
        a: (1 - t * 0.6) * (0.25 + rand() * 0.55),
        tint: rand() > 0.72 ? CYAN : rand() > 0.5 ? WHITE : VIOLET,
      });
    }
    return { pts, R };
  },
  draw: (state, f) => {
    const { pts, R } = state as unknown as { pts: DiskPt[]; R: number };
    const { ctx, w, h, t, px, py } = f;
    const cx = w * (f.narrow ? 0.76 : 0.74) + px * 20;
    const cy = h * (f.narrow ? 0.2 : 0.45) + py * 14;

    // Photon ring: a thin bright halo at the edge of the shadow.
    const ring = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.25);
    ring.addColorStop(0, "rgba(0,0,0,0)");
    ring.addColorStop(0.45, `rgba(${CYAN}, 0.3)`);
    ring.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = ring;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
    ctx.fill();

    for (const p of pts) {
      // Keplerian-ish: closer orbits sweep faster.
      const speed = f.reduced ? 0 : (R / p.r) ** 1.5 * 0.00052;
      const th = p.th + t * speed;
      const x = cx + Math.cos(th) * p.r;
      const y = cy + Math.sin(th) * p.r * 0.3;
      // Doppler-ish: the limb sweeping toward the viewer reads brighter.
      const boost = 0.55 + 0.45 * Math.sin(th);
      dot(ctx, x, y, p.size, p.tint, p.a * boost);
    }

    // The shadow itself, drawn last so the disk passes behind it.
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.82, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(3, 3, 5, 0.97)";
    ctx.fill();
  },
};

/* ============================================================
   MILKY WAY FROM EARTH — /about
   A dense star band rising from a horizon glow, split by a dust lane.
   ============================================================ */
type BandPt = { u: number; v: number; size: number; a: number; tint: string };

const milkyWay: Scene = {
  init: (w, h, narrow) => {
    const rand = rng(424242);
    const count = narrow ? 600 : 1800;
    const pts: BandPt[] = [];
    for (let i = 0; i < count; i++) {
      // Gaussian-ish spread across the band, so the core is dense.
      const g = (rand() + rand() + rand() - 1.5) / 1.5;
      pts.push({
        u: rand(),
        v: g,
        size: 0.35 + Math.pow(rand(), 2.2) * 1.7,
        a: (1 - Math.abs(g) * 0.68) * (0.3 + rand() * 0.65),
        tint: rand() > 0.93 ? CYAN : rand() > 0.87 ? VIOLET : WHITE,
      });
    }
    return { pts };
  },
  draw: (state, f) => {
    const { pts } = state as unknown as { pts: BandPt[] };
    const { ctx, w, h, px, py } = f;
    const tilt = -0.42;
    const cx = w * 0.5 + px * 18;
    const cy = h * 0.46 + py * 12;
    const len = Math.hypot(w, h) * 1.15;
    const halfW = Math.min(w, h) * 0.34;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);

    // Diffuse glow along the band.
    const glow = ctx.createLinearGradient(0, -halfW, 0, halfW);
    glow.addColorStop(0, "rgba(0,0,0,0)");
    glow.addColorStop(0.38, `rgba(${WHITE}, 0.07)`);
    glow.addColorStop(0.46, `rgba(${CYAN}, 0.1)`);
    glow.addColorStop(0.5, `rgba(${VIOLET}, 0.06)`);
    glow.addColorStop(0.54, `rgba(${CYAN}, 0.1)`);
    glow.addColorStop(0.62, `rgba(${WHITE}, 0.07)`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(-len / 2, -halfW, len, halfW * 2);

    for (const p of pts) {
      const x = -len / 2 + p.u * len;
      const y = p.v * halfW;
      // The dark dust lane that splits the band down its middle.
      const inLane = Math.abs(p.v) < 0.1;
      dot(ctx, x, y, p.size, p.tint, inLane ? p.a * 0.22 : p.a);
    }
    ctx.restore();

    // Ground haze: the giveaway that this is seen from a planet.
    const horizon = ctx.createLinearGradient(0, h * 0.78, 0, h);
    horizon.addColorStop(0, "rgba(0,0,0,0)");
    horizon.addColorStop(1, `rgba(${VIOLET}, 0.07)`);
    ctx.fillStyle = horizon;
    ctx.fillRect(0, h * 0.78, w, h * 0.22);
  },
};

/* ============================================================
   ORBITS — /experience
   Concentric paths, each with a body running it at its own rate.
   ============================================================ */
type Orbit = { rx: number; ry: number; speed: number; phase: number; size: number; tint: string };

const orbits: Scene = {
  init: (w, h) => {
    const R = Math.min(w, h) * 0.46;
    const list: Orbit[] = [0.4, 0.58, 0.76, 0.94].map((k, i) => ({
      rx: R * k,
      ry: R * k * 0.34,
      speed: 0.00022 / (0.5 + k),
      phase: i * 1.7,
      size: 2.6 - i * 0.35,
      tint: i === 0 ? CYAN : i === 3 ? VIOLET : WHITE,
    }));
    return { list };
  },
  draw: (state, f) => {
    const { list } = state as unknown as { list: Orbit[] };
    const { ctx, w, h, t, px, py } = f;
    const cx = w * 0.74 + px * 22;
    const cy = h * (f.narrow ? 0.22 : 0.46) + py * 15;
    const tilt = -0.32;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);

    for (const o of list) {
      ctx.beginPath();
      ctx.ellipse(0, 0, o.rx, o.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${o.tint}, 0.13)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      const th = o.phase + (f.reduced ? 0 : t * o.speed);
      const x = Math.cos(th) * o.rx;
      const y = Math.sin(th) * o.ry;
      dot(ctx, x, y, o.size * 4.5, o.tint, 0.1);
      dot(ctx, x, y, o.size, o.tint, 0.95);
    }

    dot(ctx, 0, 0, 20, CYAN, 0.08);
    dot(ctx, 0, 0, 3.4, CYAN, 0.9);
    ctx.restore();
  },
};

/* ============================================================
   NEBULA — /research
   Soft overlapping clouds, drifting. Where things are still forming.
   ============================================================ */
type Cloud = { x: number; y: number; r: number; tint: string; a: number; drift: number };

const nebula: Scene = {
  init: (w, h, narrow) => {
    const rand = rng(7777);
    const n = narrow ? 5 : 9;
    const clouds: Cloud[] = [];
    for (let i = 0; i < n; i++) {
      clouds.push({
        x: 0.45 + rand() * 0.5,
        y: 0.2 + rand() * 0.55,
        r: (0.12 + rand() * 0.2) * Math.min(w, h),
        tint: i % 3 === 0 ? VIOLET : i % 3 === 1 ? CYAN : WHITE,
        a: 0.045 + rand() * 0.05,
        drift: rand() * Math.PI * 2,
      });
    }
    return { clouds };
  },
  draw: (state, f) => {
    const { clouds } = state as unknown as { clouds: Cloud[] };
    const { ctx, w, h, t, px, py } = f;
    for (const c of clouds) {
      const wob = f.reduced ? 0 : Math.sin(t * 0.00008 + c.drift) * 14;
      const x = c.x * w + wob + px * 20;
      const y = c.y * h + Math.cos(t * 0.00006 + c.drift) * 10 + py * 14;
      const g = ctx.createRadialGradient(x, y, 0, x, y, c.r);
      g.addColorStop(0, `rgba(${c.tint}, ${c.a})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - c.r, y - c.r, c.r * 2, c.r * 2);
    }
  },
};

/* ============================================================
   DISTANT — /resume, /contact
   One far-off galaxy. Deliberately quiet; these pages are for reading.
   ============================================================ */
const distant: Scene = {
  init: () => ({}),
  draw: (_state, f) => {
    const { ctx, w, h, px, py } = f;
    const cx = w * 0.82 + px * 12;
    const cy = h * 0.3 + py * 9;
    const r = Math.min(w, h) * 0.17;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.5);
    ctx.scale(1, 0.36);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(${WHITE}, 0.1)`);
    g.addColorStop(0.4, `rgba(${CYAN}, 0.05)`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};

const SCENES: Record<Exclude<SceneName, "deep-field">, Scene> = {
  "spiral-galaxy": spiralGalaxy,
  "black-hole": blackHole,
  "milky-way": milkyWay,
  orbits,
  nebula,
  distant,
};

/**
 * Route-aware celestial scene, drawn on its own canvas behind the content and
 * above the universal star field. Home uses no scene — the open deep field is
 * its identity — so this renders nothing there.
 */
export default function SpaceScene() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const { scene, label } = sceneForRoute(pathname);

  useEffect(() => {
    if (scene === "deep-field") return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const impl = SCENES[scene];
    const narrow = window.innerWidth < 768;
    let w = 0;
    let h = 0;
    let state: unknown;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = impl.init(w, h, narrow);
    };
    resize();

    let targetX = 0;
    let targetY = 0;
    let px = 0;
    let py = 0;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const allowPointer = !coarse && !reduced;
    if (allowPointer) window.addEventListener("pointermove", onPointer, { passive: true });

    const render = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      px += (targetX - px) * 0.035;
      py += (targetY - py) * 0.035;
      impl.draw(state as never, { ctx, w, h, t, px, py, reduced, narrow });
    };

    let raf = 0;
    let elapsed = 0;
    let last = 0;
    let running = true;

    const loop = (now: number) => {
      if (!running) return;
      const dt = last ? Math.min(now - last, 48) : 16;
      last = now;
      elapsed += dt;
      render(elapsed);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) render(0);
    else raf = requestAnimationFrame(loop);

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        resize();
        if (reduced) render(0);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      if (allowPointer) window.removeEventListener("pointermove", onPointer);
    };
  }, [scene, reduced]);

  if (scene === "deep-field") return null;

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-45 sm:opacity-100"
    />
  );
}
