import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build"
  },
  // Server settings are only used in development and will be ignored by Vercel
  server: {
    host: "0.0.0.0",
    port: 3000
  }
});
