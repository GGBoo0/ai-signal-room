import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? "/ai-signal-room/" : "/",
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    proxy: {
      "/api/market": {
        target: "https://query1.finance.yahoo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/market\//, "/v8/finance/chart/"),
      },
      "/api/news": {
        target: "https://api.gdeltproject.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, "/api/v2/doc/doc"),
      },
    },
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
