"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MatrixRain from "./MatrixRain";

interface Particle {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

export default function Background() {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generated after mount to avoid SSR/CSR hydration mismatch from Math.random.
  useEffect(() => {
    const next = Array.from({ length: 26 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 9 + 7,
      delay: Math.random() * 6,
      drift: Math.random() * 40 - 20,
    }));
    setParticles(next);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-base-950" />

      {/* Futuristic grid */}
      <div className="grid-bg absolute inset-0 opacity-60" />

      {/* Matrix code rain */}
      <MatrixRain />

      {/* Blurred red glow circles */}
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-radial-neon blur-3xl animate-pulseGlow" />
      <div
        className="absolute -right-32 top-1/3 h-[30rem] w-[30rem] rounded-full bg-radial-neon blur-3xl animate-pulseGlow"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full bg-radial-neon blur-3xl animate-pulseGlow"
        style={{ animationDelay: "4s" }}
      />

      {/* Floating red particles */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-neon"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 8px rgba(255,30,60,0.9)",
          }}
          animate={{ y: [0, -60, 0], x: [0, p.drift, 0], opacity: [0, 0.9, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Film grain */}
      <div className="grain absolute inset-0" />

      {/* Vignette to seat content on black */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-950 via-transparent to-base-950" />
    </div>
  );
}
