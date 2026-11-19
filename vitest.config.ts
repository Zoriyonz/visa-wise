import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@data": fromRoot("./data"),
      "@": fromRoot("./src"),
      // "server-only" throws outside a React Server Component; stub it for unit tests.
      "server-only": fromRoot("./src/test/server-only.ts"),
    },
  },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
