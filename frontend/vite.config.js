// vite.config.js
// Vite configuration for the React frontend
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend runs on http://localhost:3000
    // Proxy API calls to the Express backend so we avoid CORS issues during dev
    // Any request starting with /products or /cart will be forwarded to :5000
    proxy: {
      "/products": "http://localhost:5001",
      "/cart": "http://localhost:5001",
    },
  },
});
