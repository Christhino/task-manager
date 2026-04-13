import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',

    coverage: {
      provider: 'v8',

      reporter: ['text', 'html', 'json'],

      reportsDirectory: './coverage',

      include: ['src/**/*.ts'],

      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        'src/index.ts'
      ],

      thresholds: {
        lines: 60,
        functions: 60,
        branches: 40,
        statements: 60,
      },
    },
  },
})