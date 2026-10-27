"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle background of one-line drawings (thrift-shop things) behind the whole site.
 *
 * Change the look here:
 *   mode    "draw"    = drawings appear as if drawn with a pen, then fade and reappear elsewhere
 *           "float"   = finished drawings drift slowly upward
 *           "pattern" = still wallpaper (always used for visitors who prefer reduced motion)
 *   color   "grey" | "heart"
 *   opacity 0.06 (barely there) – 0.5 (strong)
 *   speed   0.3 (slow) – 2 (fast)
 */
const SETTINGS = {
  mode: "draw" as "draw" | "float" | "pattern",
  color: "grey" as "grey" | "heart",
  opacity: 0.22,
  speed: 1,
};

// One-line drawings on a 64×64 grid
const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const SHAPES: Record<string, string> = {
  hjerte: "M32 52C12 39 7 26 14 17c7-8 15-4 18 3c3-7 11-11 18-3c7 9 2 22-18 35",
  kake: "M8 50h48V34L8 44v6M8 44l48-18v8M24 38V24m0 0c-3-3-1-7 0-9c1 2 3 6 0 9M38 33V19m0 0c-3-3-1-7 0-9c1 2 3 6 0 9",
  stol: "M20 6v50M20 32h26v24M20 32V6h18v26M26 12h6M26 18h6",
  druer:
    "M33 8c-2 4 0 7 6 6M33 10v6" +
    circ(26, 22, 5) + circ(37, 22, 5) + circ(31, 31, 5) + circ(42, 31, 5) + circ(25, 40, 5) + circ(36, 40, 5) + circ(31, 49, 5),
  sykkel: circ(16, 42, 10) + circ(48, 42, 10) + "M16 42l12-18h14l6 18M28 24l6 18H16M34 42l8-18M24 20h8M42 24l-2-6h6",
  tekanne: "M14 46c-4-16 6-24 18-24s22 8 18 24ZM50 34c8-2 10-8 6-12M14 34l-8-8M28 22c0-6 8-6 8 0M10 46h44",
  lampe: "M22 10h20l8 20H14ZM32 30v24M22 56h20",
  henger: "M32 16c0-6 8-6 8 0c0 4-8 4-8 10L8 44h48L32 26",
  vase: "M24 56c-8-12-4-22 2-26h12c6 4 10 14 2 26ZM32 30V14m0 0c-6-6-6-10 0-8c6-2 6 2 0 8M32 22c-6 0-8-4-8-6M32 20c5 0 7-3 7-5",
  bok: "M8 16l24 6l24-6v34l-24 6l-24-6ZM32 22v34M14 24l12 3M14 30l12 3M38 27l12-3",
  kopp: "M14 24h32l-4 28H18ZM46 30c10 0 10 12-2 12M24 18c-2-4 2-6 0-10M34 18c-2-4 2-6 0-10",
  plate: circ(32, 32, 22) + circ(32, 32, 7) + circ(32, 32, 1.5) + "M18 24c3-5 8-8 14-8",
};
const NAMES = Object.keys(SHAPES);

type Item = {
  k: string; x: number; y: number; size: number; rot: number;
  t?: number; dur?: number; vy?: number; vr?: number; sway?: number;
};

export function DoodleBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const paths: Record<string, Path2D> = {};
    const lengths: Record<string, number> = {};
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    document.body.appendChild(svg);
    for (const k of NAMES) {
      paths[k] = new Path2D(SHAPES[k]);
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", SHAPES[k]);
      svg.appendChild(p);
      try { lengths[k] = p.getTotalLength(); } catch { lengths[k] = 300; }
    }
    svg.remove();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = () => NAMES[Math.floor(Math.random() * NAMES.length)];
    let W = 0, H = 0, DPR = 1, raf = 0, last = performance.now();
    let items: Item[] = [];
    let color = "";

    const still = () => SETTINGS.mode === "pattern" || reduce.matches;
    const readColor = () => {
      const v = SETTINGS.color === "heart" ? "--color-heart" : "--color-doodle";
      color = getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#8a9692";
    };
    const slots = (cell: number) => {
      const out: { x: number; y: number }[] = [];
      const cols = Math.max(2, Math.ceil(W / cell)), rows = Math.max(2, Math.ceil(H / cell));
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          out.push({ x: (c + 0.5) * cell + rand(-cell * 0.25, cell * 0.25), y: (r + 0.5) * cell + rand(-cell * 0.25, cell * 0.25) });
      return out.sort(() => Math.random() - 0.5);
    };
    const small = () => W < 640;
    const drawer = (x: number, y: number, phase: number): Item =>
      ({ k: pick(), x, y, size: rand(small() ? 38 : 48, small() ? 52 : 68), rot: rand(-0.3, 0.3), t: phase * 9, dur: rand(8, 12) });
    const floater = (initial: boolean): Item =>
      ({ k: pick(), x: rand(0, W), y: initial ? rand(0, H) : H + 80, size: rand(small() ? 34 : 42, small() ? 50 : 64),
         rot: rand(-0.4, 0.4), vr: rand(-0.05, 0.05), vy: rand(8, 16), sway: rand(0, Math.PI * 2) });

    const build = () => {
      if (still()) {
        items = slots(small() ? 130 : 170).map((p, i) => ({ k: NAMES[i % NAMES.length], x: p.x, y: p.y, size: small() ? 40 : 52, rot: rand(-0.25, 0.25) }));
      } else if (SETTINGS.mode === "draw") {
        items = slots(small() ? 150 : 200).slice(0, small() ? 7 : 14).map((p) => drawer(p.x, p.y, Math.random()));
      } else {
        items = Array.from({ length: small() ? 10 : 20 }, () => floater(true));
      }
    };

    const drawShape = (it: Item, prog: number, alpha: number, x = it.x) => {
      const s = it.size / 64;
      ctx.save();
      ctx.translate(x, it.y);
      ctx.rotate(it.rot);
      ctx.scale(s, s);
      ctx.translate(-32, -32);
      ctx.globalAlpha = SETTINGS.opacity * alpha;
      ctx.lineWidth = (1.6 / s) * (small() ? 0.9 : 1);
      if (prog < 1) ctx.setLineDash([lengths[it.k] * prog, lengths[it.k]]);
      else ctx.setLineDash([]);
      ctx.stroke(paths[it.k]);
      ctx.restore();
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) * SETTINGS.speed;
      last = now;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (still()) { drawShape(it, 1, 1); continue; }
        if (SETTINGS.mode === "draw") {
          it.t! += dt;
          const f = it.t! / it.dur!;
          if (f >= 1) { const s = slots(small() ? 150 : 200)[0]; items[i] = drawer(s.x, s.y, 0); continue; }
          drawShape(it, Math.min(1, f / 0.35), f < 0.8 ? 1 : 1 - (f - 0.8) / 0.2);
        } else {
          it.y -= it.vy! * dt;
          it.sway! += dt * 0.6;
          it.rot += it.vr! * dt;
          if (it.y < -80) { items[i] = floater(false); continue; }
          const edge = Math.max(0, Math.min(1, (it.y + 60) / 120, (H + 60 - it.y) / 160));
          drawShape(it, 1, edge, it.x + Math.sin(it.sway!) * 10);
        }
      }
      if (!still()) raf = requestAnimationFrame(frame);
    };

    const restart = () => {
      cancelAnimationFrame(raf);
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      readColor();
      build();
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    // Follow theme changes (toggle in the header, or the device switching light/dark)
    const themeObs = new MutationObserver(() => { readColor(); if (still()) restart(); });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const darkMq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => { readColor(); if (still()) restart(); };
    darkMq.addEventListener("change", onScheme);
    reduce.addEventListener("change", restart);
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(restart, 150); };
    window.addEventListener("resize", onResize);

    restart();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      themeObs.disconnect();
      darkMq.removeEventListener("change", onScheme);
      reduce.removeEventListener("change", restart);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 block h-full w-full" />;
}
