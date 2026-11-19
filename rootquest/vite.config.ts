import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { GAME_NAME } from "./src/config";

// Puts the game name from src/config.ts into index.html's <title>,
// so renaming the game only ever needs one edit.
export default defineConfig({
  plugins: [
    react(),
    {
      name: "game-name",
      transformIndexHtml: (html) => html.replaceAll("%GAME_NAME%", GAME_NAME),
    },
  ],
});
