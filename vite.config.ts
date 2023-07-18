import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    react(), 
    viteTsconfigPaths(),
    svgrPlugin(),
    eslint(),
    checker({
      typescript: true
    })
  ],
});