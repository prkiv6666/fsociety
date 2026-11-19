import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ProgressProvider } from "./engine/useProgress";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* basename lets the site live in a sub-folder (needed for GitHub Pages) */}
    <BrowserRouter basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </BrowserRouter>
  </StrictMode>,
);
