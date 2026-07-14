import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
      routers: {
        client: {
          vite: {
            build: {
              outDir: ".dist/client",
            },
          },
        },
        server: {
          vite: {
            build: {
              outDir: ".dist/server",
            },
          },
        },
        ssr: {
          vite: {
            build: {
              outDir: ".dist/server",
            },
          },
        },
      },
    }),
    react(),
  ],
});
