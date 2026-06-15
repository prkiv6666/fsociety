"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle falling-code "matrix" rain rendered on a canvas, tinted to the
 * site's red theme and kept low-opacity so it sits behind the content.
 */
export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const chars = "01アイウエオカキクケコサシスセソ$#%&*+ABCDEF</>".split("");
    const fontSize = 16;
    let columns = 0;
    let colStep = fontSize;
    let drops: number[] = [];
    let dpr = 1;
    let interval = 55; // ms between frames — slow, ambient

    const setup = () => {
      // On phones: fewer columns + slower frames to save battery/CPU.
      const mobile = window.innerWidth < 640;
      colStep = mobile ? fontSize * 1.7 : fontSize;
      interval = mobile ? 95 : 55;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(window.innerWidth / colStep);
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * window.innerHeight) / fontSize),
      );
    };
    setup();

    let raf = 0;
    let last = 0;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < interval) return;
      last = t;

      // fade previous frame for trailing effect
      ctx.fillStyle = "rgba(8, 6, 8, 0.12)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * colStep;
        const y = drops[i] * fontSize;

        // bright leading char, dimmer trail
        ctx.fillStyle =
          Math.random() > 0.975 ? "rgba(255,90,110,0.9)" : "rgba(220,38,38,0.55)";
        ctx.fillText(text, x, y);

        if (y > window.innerHeight && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    if (!reduce) raf = requestAnimationFrame(draw);

    const onResize = () => setup();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.10]"
    />
  );
}
