import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'html', 'lcov', 'json-summary', 'json'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
      include: [
        'src/lib/middleware/**/*.ts',
        'src/lib/middleware/**/*.tsx',
        'src/components/**/*.ts',
        'src/components/**/*.tsx',
        'src/core/molecules/**/*.ts',
        'src/core/molecules/**/*.tsx',
      ],
      exclude: [
        'src/**/*.type.ts',
        'src/**/*.type.tsx',
        'src/byoc/**/*.ts',
        'src/byoc/**/*.tsx',
        'src/components/content-sdk/**/*.ts',
        'src/components/content-sdk/**/*.tsx',
        'src/components/sxa/**/*.ts',
        'src/components/sxa/**/*.tsx',
        'src/core/ui/**/*.ts',
        'src/core/ui/**/*.tsx',
      ],
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
});
