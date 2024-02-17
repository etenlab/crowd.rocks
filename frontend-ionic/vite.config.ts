import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig, UserConfigExport } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

type CustomUserConfigExport = UserConfigExport & {
  test: {
    globals: boolean;
    environment: string;
    setupFiles: string;
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    legacy(),
    eslintPlugin({
      cache: false,
      include: ['./src/**/*.ts', './src/**/*.tsx'],
      exclude: [],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
} as CustomUserConfigExport);
