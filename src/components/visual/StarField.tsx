"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";

type Star = {
  x: number; // normalized 0..1
  y: number;
  z: number; // depth 0 (far) .. 1 (near) — drives parallax and size
  r: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: "white" | "cyan" | "violet";
};

type Dust = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
};

type Shooter = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  /** Trail length in px. */
  tail: number;
  /** Peak opacity. Bolides burn much brighter. */
  peak: number;
  width: number;
  tint: string;
  bolide: boolean;
};

const TINT: Record<Star["hue"], string> = {
  white: "245, 247, 250",
  cyan: "126, 220, 240",
  violet: "139, 130, 240",
};

/**
 * Layered deep-space field rendered on a single canvas.
 *
 * Five conceptual layers — far stars, parallax stars, near stars, drifting
 * dust and the occasional shooting star — drawn in one pass so the page
 * never pays for hundreds of DOM nodes.
 *
 * It renders a single static frame when the visitor prefers reduced motion,
 * drops density sharply on small screens, and suspends its loop whenever the
 * tab is hidden or the canvas scrolls out of view.
 */
export default function StarField({
  density = 1,
  interactive = true,
  className = "",
}: {
  density?: number;
  interactive?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 768;

    // Density is deliberately conservative on phones: the field should read
    // as atmosphere, never as a battery drain.
    const starCount = Math.round((narrow ? 90 : 230) * density);
    const dustCount = narrow ? 0 : Math.round(34 * density);

    const stars: Star[] = [];
    const dust: Dust[] = [];
    const shooters: Shooter[] = [];
    let nextShooterAt = 1200;

    // Deterministic-ish scatter with a slight bias away from dead center,
    // so the hero copy sits in comparatively quiet sky.
    for (let i = 0; i < starCount; i++) {
      const z = Math.pow(Math.random(), 1.7); // bias toward far layers
      const roll = Math.random();
      stars.push({
        x: Math.random(),
        y: Math.random(),
        z,
        r: 0.35 + z * 1.25,
        alpha: 0.18 + z * 0.62,
        twinkleSpeed: 0.0006 + Math.random() * 0.0016,
        twinklePhase: Math.random() * Math.PI * 2,
        hue: roll > 0.94 ? "cyan" : roll > 0.89 ? "violet" : "white",
      });
    }

    for (let i = 0; i < dustCount; i++) {
      dust.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.000045,
        vy: -0.00002 - Math.random() * 0.00004,
        r: 0.5 + Math.random() * 1.1,
        alpha: 0.05 + Math.random() * 0.1,
      });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    // Pointer parallax, smoothed toward the target so motion never snaps.
    let targetPx = 0;
    let targetPy = 0;
    let px = 0;
    let py = 0;

    const onPointer = (e: PointerEvent) => {
      targetPx = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPy = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const allowPointer = interactive && !coarse && !reduced;
    if (allowPointer) window.addEventListener("pointermove", onPointer, { passive: true });

    const drawStar = (s: Star, t: number, ox: number, oy: number) => {
      const depthShift = 0.4 + s.z * 1.6;
      const x = s.x * width + ox * depthShift * 16;
      const y = s.y * height + oy * depthShift * 10;
      if (x < -6 || x > width + 6 || y < -6 || y > height + 6) return;

      const twinkle = reduced
        ? 1
        : 0.72 + 0.28 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);

      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${TINT[s.hue]}, ${(s.alpha * twinkle).toFixed(3)})`;
      ctx.fill();

      // Brightest near-layer stars get a soft bloom — a handful of them only.
      if (s.z > 0.86) {
        ctx.beginPath();
        ctx.arc(x, y, s.r * 3.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${TINT[s.hue]}, ${(s.alpha * twinkle * 0.08).toFixed(3)})`;
        ctx.fill();
      }
    };

    const render = (t: number, dt: number) => {
      ctx.clearRect(0, 0, width, height);

      px += (targetPx - px) * 0.035;
      py += (targetPy - py) * 0.035;

      for (const s of stars) drawStar(s, t, px, py);

      for (const d of dust) {
        if (!reduced) {
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          if (d.y < -0.02) {
            d.y = 1.02;
            d.x = Math.random();
          }
          if (d.x < -0.02) d.x = 1.02;
          if (d.x > 1.02) d.x = -0.02;
        }
        ctx.beginPath();
        ctx.arc(
          d.x * width + px * 26,
          d.y * height + py * 16,
          d.r,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(167, 173, 184, ${d.alpha})`;
        ctx.fill();
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        s.life += dt;
        const p = s.life / s.maxLife;
        if (p >= 1) {
          shooters.splice(i, 1);
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // Fade in then out across the arc.
        const a = Math.sin(p * Math.PI) * s.peak;
        const tailX = s.x - s.vx * s.tail;
        const tailY = s.y - s.vy * s.tail;
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(${s.tint}, 0)`);
        grad.addColorStop(0.72, `rgba(${s.tint}, ${(a * 0.4).toFixed(3)})`);
        grad.addColorStop(1, `rgba(203, 242, 250, ${a.toFixed(3)})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // A bolide carries a bright head and a soft halo around it.
        if (s.bolide) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(235, 248, 252, ${a.toFixed(3)})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(s.x, s.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.tint}, ${(a * 0.16).toFixed(3)})`;
          ctx.fill();
        }
      }
    };

    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let running = true;

    const loop = (now: number) => {
      if (!running) return;
      // Clamp dt so a backgrounded tab doesn't fast-forward the field.
      const dt = last ? Math.min(now - last, 48) : 16;
      last = now;
      elapsed += dt;

      // Meteors run on phones too now, just rarer and never more than one.
      if (!reduced) {
        nextShooterAt -= dt;
        const cap = narrow ? 1 : 3;
        if (nextShooterAt <= 0 && shooters.length < cap) {
          const fromLeft = Math.random() > 0.5;
          const bolide = !narrow && Math.random() > 0.82;
          const speed = (bolide ? 0.3 : 0.42) + Math.random() * 0.26;
          const roll = Math.random();
          shooters.push({
            x: fromLeft ? -60 : width + 60,
            // Spread them across more of the sky, not just the top band.
            y: Math.random() * height * 0.75,
            vx: (fromLeft ? 1 : -1) * speed,
            vy: 0.1 + Math.random() * 0.22,
            life: 0,
            maxLife: (bolide ? 2400 : 1300) + Math.random() * 900,
            tail: bolide ? 300 : 130 + Math.random() * 120,
            peak: bolide ? 0.85 : 0.35 + Math.random() * 0.3,
            width: bolide ? 1.8 : 0.8 + Math.random() * 0.6,
            tint: roll > 0.8 ? "139, 130, 240" : "126, 220, 240",
            bolide,
          });
          nextShooterAt = narrow
            ? 11000 + Math.random() * 12000
            : 1800 + Math.random() * 4200;
        }
      }

      render(elapsed, dt);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      // One composed frame, then stop. No loop, no battery cost.
      render(0, 0);
    } else {
      raf = requestAnimationFrame(loop);
    }

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

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Suspend entirely once the field scrolls away.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduced) render(0, 0);
      }, 140);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (allowPointer) window.removeEventListener("pointermove", onPointer);
    };
  }, [density, interactive, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
