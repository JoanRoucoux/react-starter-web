import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const resolveSrc = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(process.env['VITEST'] ? [] : [babel({ presets: [reactCompilerPreset()] })]), tailwindcss()],
  resolve: {
    alias: [
      { find: '@core', replacement: resolveSrc('./src/app/core') },
      { find: '@features', replacement: resolveSrc('./src/app/features') },
      { find: '@shared', replacement: resolveSrc('./src/app/shared') },
      { find: '@testing', replacement: resolveSrc('./src/app/testing') },
      {
        find: '@environments/environment',
        replacement: resolveSrc(
          mode === 'production' ? './src/environments/environment.production.ts' : './src/environments/environment.ts',
        ),
      },
      { find: '@environments', replacement: resolveSrc('./src/environments') },
    ],
  },
  server: {
    port: 4200,
    watch: { ignored: ['**/playwright-report/**', '**/test-results/**', '**/coverage/**'] },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    globals: true,
    include: ['src/**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/app/core/api-client/**',
        'src/main.tsx',
        'src/app/**/*-routes.tsx',
        'src/environments/**',
        'src/**/*.spec.{ts,tsx}',
        'src/test-setup.ts',
        'src/app/shared/testing/**',
        'src/app/testing/**',
      ],
      reporter: ['text-summary', 'html', 'lcovonly'],
      thresholds: { statements: 85, branches: 80, functions: 70, lines: 85 },
    },
  },
}));
