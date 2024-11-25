import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

export default defineConfig({
  plugins: [svelte({ hot: false }), svelteTesting()],
  test: {
    include: ["./**/*.test.js"],
    setupFiles: ["./tests/__setup__/vitest-setup.js"],
  },
});
