"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin neon bar pinned to the very top of the viewport that fills from
 * left to right as the page is scrolled. Sits above the navbar.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-neon-deep via-neon to-neon-bright shadow-neon"
    />
  );
}
