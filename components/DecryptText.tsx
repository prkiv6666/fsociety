"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*#%&@".split("");

/**
 * "Decrypts" its text when scrolled into view: every character scrambles
 * through random glyphs, then resolves left-to-right to the real text.
 *
 * The real text is rendered (invisibly) underneath to reserve its final
 * width, so the surrounding layout never shifts while characters scramble.
 * Screen readers get the plain text via aria-label; reduced-motion users
 * skip the animation entirely.
 */
export default function DecryptText({
  text,
  className,
  duration = 1100,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** Total scramble time in ms. */
  duration?: number;
  /** Delay before the scramble starts, in ms. */
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    const chars = text.split("");
    let raf = 0;
    const start = performance.now() + delay;

    const tick = (now: number) => {
      const p = Math.min(Math.max((now - start) / duration, 0), 1);
      const revealCount = Math.floor(p * chars.length);
      const out = chars
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealCount) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setDisplay(out);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, duration, delay]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* reserves final width so the layout doesn't jitter while scrambling */}
      <span aria-hidden style={{ visibility: "hidden" }}>
        {text}
      </span>
      <span
        aria-hidden
        style={{ position: "absolute", inset: 0, whiteSpace: "pre" }}
      >
        {display}
      </span>
    </span>
  );
}
