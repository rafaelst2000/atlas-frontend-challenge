import { defineVitestConfig } from '@nuxt/test-utils/config'

// Default environment is plain Node (fast) for pure logic (SQL builders, the data
// generator, composable-level unit tests). Component/composable tests that need
// Nuxt's runtime context (auto-imports, useFetch, routing) opt in per-file with
// a `// @vitest-environment nuxt` pragma at the top of the file.
export default defineVitestConfig({
  test: {
    environment: 'node',
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
