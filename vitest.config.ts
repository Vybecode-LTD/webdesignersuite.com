import { defineConfig } from 'vitest/config';

// `npm test` runs tests/unit before the build; `npm run test:dist` runs tests/dist on the
// build's output, after `npm run build`. Playwright's specs in tests/e2e/ are not Vitest's.
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/dist/**/*.test.ts'],
  },
});
