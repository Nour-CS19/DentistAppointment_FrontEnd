import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // Only apply the GitHub Pages subpath in production builds — in dev this made
  // the whole site live under /DentistManagmentAppointment-/ instead of the root,
  // so visiting localhost:8080/ directly showed nothing.
  base: mode === "production" ? "/DentistManagmentAppointment-/" : "/",

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
