"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Animates a numeric value up from zero when scrolled into view.
 * Accepts strings like "500+", "100%", "24/7" — it counts the leading
 * number and preserves any prefix/suffix. Non-numeric values render as-is.
 */
export default function CountUp({
  value,
  duration = 1.6,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    // Parse "500+" -> { prefix:"", num:500, suffix:"+" }.
    // The suffix must contain NO digits, so values like "24/7" don't get
    // animated into nonsense (they render as-is). Parsed inside the effect
    // so the regex result isn't a new reference in the dependency array.
    const match = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(\D*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, rawNum, suffix] = match;
    const target = parseFloat(rawNum.replace(/,/g, ""));
    const decimals = rawNum.includes(".")
      ? rawNum.split(".")[1].length
      : 0;

    if (!inView) {
      setDisplay(`${prefix}0${suffix}`);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const current = (target * eased).toFixed(decimals);
      setDisplay(`${prefix}${Number(current).toLocaleString()}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
