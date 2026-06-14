/*
 * FSOCIETY brand mark — a CSS recreation of the gothic, metallic-silver
 * wordmark with a glowing red frame and "PRIVATE · SECURE · FAST" tagline.
 *
 * Want the original artwork instead? Drop the PNG at:
 *     public/fsociety-logo.png
 * then set USE_IMAGE = true below. The <BrandLockup> will render the file
 * (background-removed PNG recommended for the dark theme).
 */

import Image from "next/image";

const USE_IMAGE = true;

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`metallic font-gothic font-extrabold leading-none tracking-[0.06em] ${className}`}
    >
      FSOCIETY
    </span>
  );
}

export function BrandLockup({
  className = "",
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  if (USE_IMAGE) {
    return (
      <div className={className}>
        <Image
          src="/fsociety-logo.png"
          alt="FSOCIETY — Private. Secure. Fast."
          width={900}
          height={420}
          priority
          className="aspect-[1100/360] w-full max-w-4xl rounded-2xl border border-neon/30 object-cover shadow-[0_0_40px_rgba(220,38,38,0.25)] ring-1 ring-black/40"
        />
      </div>
    );
  }

  return (
    <div className={`logo-frame px-7 py-5 sm:px-12 sm:py-7 ${className}`}>
      <Wordmark className="block text-center text-5xl sm:text-7xl md:text-8xl" />
      {showTagline && (
        <div className="mt-3 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.42em] text-neon-soft sm:text-xs">
          <span className="h-px w-6 bg-neon/50" />
          Private · Secure · Fast
          <span className="h-px w-6 bg-neon/50" />
        </div>
      )}
    </div>
  );
}
