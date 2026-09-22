import { defineVitestConfig } from '@nuxt/test-utils/config'

// Default environment is plain Node (fast) for pure logic (SQL builders, the data
// generator, composable-level unit tests). Component/composable tests that need
// Nuxt's runtime context (auto-imports, useFetch, routing) opt in per-file with
// a `// @vitest-environment nuxt` pragma at the top of the file.
export default defineVitestConfig({
  test: {
    environment: 'node'
  }
})
