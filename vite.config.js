import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/scripts/background.js"),
        content: resolve(__dirname, "src/scripts/content.js"),
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
    outDir: "dist",
  },
});
