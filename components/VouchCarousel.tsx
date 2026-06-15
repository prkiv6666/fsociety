"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { vouchImages } from "@/lib/data";

export default function VouchCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = vouchImages.length;
  const src = (name: string) => `/vouches/${name}`;

  const go = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  // Keyboard control + background scroll lock while the lightbox is open.
  useEffect(() => {
    if (!lightbox) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, go]);

  if (count === 0) return null;

  return (
    <div className="mt-10 w-full max-w-xl">
      <div className="relative">
        {/* Slide */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-base-950/60 sm:aspect-[3/4]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              drag={count > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              onClick={() => setLightbox(true)}
              className="absolute inset-0 cursor-zoom-in"
            >
              <Image
                src={src(vouchImages[index])}
                alt={`Vouch ${index + 1}`}
                fill
                sizes="(max-width: 640px) 90vw, 36rem"
                className="object-contain"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-base-950/70 text-white backdrop-blur transition-colors hover:border-neon/60 hover:text-neon"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-base-950/70 text-white backdrop-blur transition-colors hover:border-neon/60 hover:text-neon"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {vouchImages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to vouch ${i + 1}`}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-neon shadow-neon" : "w-2 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setLightbox(false)}
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white hover:border-neon/60 hover:text-neon"
            >
              <X className="h-5 w-5" />
            </button>

            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition-colors hover:border-neon/60 hover:text-neon sm:left-6"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition-colors hover:border-neon/60 hover:text-neon sm:right-6"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.div
              key={index}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[85vh] w-full max-w-3xl"
            >
              <Image
                src={src(vouchImages[index])}
                alt={`Vouch ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>

            {count > 1 && (
              <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-xs text-zinc-300 backdrop-blur">
                {index + 1} / {count}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
