import { defineVitestConfig } from '@nuxt/test-utils/config'

// Tests live in test/, mirroring the source tree they cover (test/components/…
// mirrors app/components/…), so app/ and server/ hold only shippable code.
//
// Default environment is plain Node (fast) for pure logic (SQL builders, the data
// generator, composable-level unit tests). Component/composable tests that need
// Nuxt's runtime context (auto-imports, useFetch, routing) opt in per-file with
// a `// @vitest-environment nuxt` pragma at the top of the file.
export default defineVitestConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Components are the contract with the user; they carry a hard floor.
      include: ['app/components/**/*.vue'],
      thresholds: {
        // perFile, so one very well covered component can't carry a neglected one
        perFile: true,
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90
      }
    }
  }
})
