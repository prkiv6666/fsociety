import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <span className="eyebrow">
          <span className="text-neon-soft">[</span> {eyebrow}{" "}
          <span className="text-neon-soft">]</span>
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="section-title mt-4">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
