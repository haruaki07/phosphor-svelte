import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

export default defineConfig({
  plugins: [svelte({ hot: false }), svelteTesting()],
  test: {
    environment: "jsdom",
    include: ["./**/*.{test,spec}.js"],
    setupFiles: ["./tests/__setup__/vitest-setup.js"],
  },
});
