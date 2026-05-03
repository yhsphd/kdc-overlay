import { fileURLToPath, URL } from "node:url";

import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        intro_showcase: resolve(__dirname, "intro-showcase.html"),
        intro_match: resolve(__dirname, "intro-match.html"),
        outro: resolve(__dirname, "outro.html"),
        showcase: resolve(__dirname, "showcase.html"),
        ingame: resolve(__dirname, "ingame.html"),
        banpick: resolve(__dirname, "banpick.html"),
      },
    },
  },
});
