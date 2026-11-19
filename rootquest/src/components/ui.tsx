import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-panel ${className}`}>{children}</div>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" };

export function Button({ variant = "ghost", className = "", ...rest }: BtnProps) {
  const styles = {
    primary: "bg-accent text-base hover:brightness-110 font-semibold",
    ghost: "border border-line bg-raised text-ink hover:border-accent/60",
    danger: "border border-danger/60 text-danger hover:bg-danger/10",
  }[variant];
  return (
    <button
      className={`rounded-md px-4 py-2 font-mono text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`}
      {...rest}
    />
  );
}

/** Small message under a puzzle: green when right, red when wrong. */
export function Feedback({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div
      role="status"
      className={`mt-3 rounded-md border px-3 py-2 text-sm ${
        ok ? "border-accent/40 bg-accent/5 text-ink" : "border-danger/40 bg-danger/5 text-ink"
      }`}
    >
      <span className={`mr-2 font-mono ${ok ? "text-accent" : "text-danger"}`}>{ok ? "[✓]" : "[✗]"}</span>
      {children}
    </div>
  );
}

/** Shown when a puzzle is beaten, so the player can read the last feedback first. */
export function SolvedBar({ onContinue, label = "Capture the flag →" }: { onContinue: () => void; label?: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-accent/50 bg-accent/10 px-4 py-3">
      <span className="font-mono text-sm text-accent glow">ACCESS GRANTED</span>
      <Button variant="primary" onClick={onContinue} autoFocus>
        {label}
      </Button>
    </div>
  );
}
