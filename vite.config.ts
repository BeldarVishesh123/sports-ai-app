import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
    target: "esnext",
    outDir: "dist", // ✅ safer default (was "build")
  },
  server: {
    port: 3000, // ✅ open at http://localhost:3000
    open: true, // ✅ auto-open browser
  },
});
