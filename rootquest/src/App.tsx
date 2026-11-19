import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { GAME_NAME } from "./config";
import { LevelMap } from "./screens/LevelMap";
import { LevelScreen } from "./screens/LevelScreen";
import { Settings } from "./screens/Settings";

function LevelRoute() {
  const { id } = useParams();
  // key={id} = start each level with a fresh puzzle when the URL changes.
  return <LevelScreen key={id} id={Number(id)} />;
}

export function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-base/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-mono text-lg font-semibold text-accent glow">
            &gt;_ {GAME_NAME}
          </Link>
          <nav className="flex gap-4 font-mono text-sm text-muted">
            <Link to="/" className="hover:text-accent">map</Link>
            <Link to="/settings" className="hover:text-accent">settings</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Routes>
          <Route path="/" element={<LevelMap />} />
          <Route path="/level/:id" element={<LevelRoute />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="mx-auto max-w-3xl px-4 pb-8 text-center text-xs text-muted">
        Everything here is simulated. No real systems, networks or people are touched.
      </footer>
    </div>
  );
}
