import { useRef, useState, type PointerEvent } from "react";
import type { PuzzleProps } from "../engine/PuzzleRenderer";
import type { CipherPuzzle } from "../levels/types";
import { Button, Feedback, SolvedBar } from "../components/ui";

const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STEP = 360 / 26;
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Shift every letter back by `k` (decrypting a Caesar cipher). */
export function caesarDecode(text: string, k: number) {
  return text.replace(/[A-Z]/g, (c) => ABC[mod(c.charCodeAt(0) - 65 - k, 26)]);
}

export function CipherWheel({ puzzle, onSolve }: PuzzleProps<CipherPuzzle>) {
  // `turns` is not wrapped to 0–25 so the wheel animates the short way round.
  const [turns, setTurns] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const shift = mod(turns, 26);
  const solved = feedback?.ok === true;
  const decoded = caesarDecode(puzzle.ciphertext, shift);
  const drag = useRef<{ startAngle: number; startTurns: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  function angleOf(e: PointerEvent) {
    const r = svgRef.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  }
  function onDown(e: PointerEvent<SVGSVGElement>) {
    if (solved) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startAngle: angleOf(e), startTurns: turns };
  }
  function onMove(e: PointerEvent<SVGSVGElement>) {
    if (!drag.current) return;
    let delta = angleOf(e) - drag.current.startAngle;
    delta = mod(delta + 180, 360) - 180; // keep within -180..180
    setTurns(drag.current.startTurns + Math.round(delta / STEP));
  }
  const onUp = () => {
    drag.current = null;
  };

  function turn(by: number) {
    setTurns((t) => t + by);
    setFeedback(null);
  }
  function submit() {
    setFeedback(
      shift === mod(puzzle.shift, 26)
        ? { ok: true, text: `Shift ${shift} — the message is readable. Nice decoding!` }
        : { ok: false, text: "Still gibberish. Keep turning until you see real words." },
    );
  }

  // Letters sit around a circle. Outer ring = encrypted letters (fixed).
  // Inner ring = the real letters, rotated by the current shift.
  const ring = (r: number, cls: string) =>
    [...ABC].map((ch, i) => {
      const a = i * STEP;
      const x = r * Math.sin((a * Math.PI) / 180);
      const y = -r * Math.cos((a * Math.PI) / 180);
      return (
        <text key={ch} x={x} y={y} transform={`rotate(${a} ${x} ${y})`} className={cls} textAnchor="middle" dominantBaseline="central">
          {ch}
        </text>
      );
    });

  return (
    <div>
      <div className="rounded-md border border-line bg-raised p-3 font-mono">
        <div className="text-xs text-muted">intercepted:</div>
        <div className="break-words text-ink">{puzzle.ciphertext}</div>
        <div className="mt-2 text-xs text-muted">decoded with shift {shift}:</div>
        <div className={`break-words ${solved ? "text-accent glow" : "text-ink"}`}>{decoded}</div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <svg
          ref={svgRef}
          viewBox="-150 -150 300 300"
          className="w-full max-w-[300px] touch-none select-none cursor-grab active:cursor-grabbing"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-label="Cipher wheel. Use the buttons to rotate."
        >
          <circle r="145" className="fill-panel stroke-line" />
          <circle r="113" className="fill-raised stroke-line" />
          <circle r="82" className="fill-panel stroke-line" />
          {ring(129, "fill-muted font-mono text-[15px]")}
          {/* Rotating the inner ring = choosing the shift. Each encrypted letter
              then sits over the letter `shift` places before it. */}
          <g style={{ transform: `rotate(${turns * STEP}deg)`, transition: "transform 150ms ease-out" }}>
            {ring(98, "fill-accent font-mono text-[15px] font-semibold")}
          </g>
          <polygon points="0,-148 -7,-160 7,-160" className="fill-accent" transform="translate(0 6)" />
          <text y="-8" textAnchor="middle" className="fill-muted font-mono text-[11px]">SHIFT</text>
          <text y="18" textAnchor="middle" className="fill-accent font-mono text-[28px] font-semibold">{shift}</text>
        </svg>
        <p className="text-center text-xs text-muted">Outer ring: encrypted letter · inner ring: real letter. Drag the wheel or use the buttons.</p>
        <div className="flex gap-2">
          <Button onClick={() => turn(-1)} disabled={solved} aria-label="Shift down">◀</Button>
          <Button variant="primary" onClick={submit} disabled={solved}>Decode</Button>
          <Button onClick={() => turn(1)} disabled={solved} aria-label="Shift up">▶</Button>
        </div>
      </div>

      {feedback && <Feedback ok={feedback.ok}>{feedback.text}</Feedback>}
      {solved && <SolvedBar onContinue={onSolve} />}
    </div>
  );
}
