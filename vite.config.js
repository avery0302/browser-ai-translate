import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import ViteCssInjectedByJs from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), ViteCssInjectedByJs()],
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, "scripts/background.jsx"),
        content: resolve(__dirname, "scripts/content.jsx"),
      },
      output: {
        entryFileNames: "scripts/[name].js",
      },
    },
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@public": resolve(__dirname, "public"),
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: "https://translate.ruskcode.top",
        target: "http://localhost:3000",
      },
    },
  },
});
