import { defineConfig, loadEnv } from 'vite';
import { checker } from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.VITE_MAPKITJS_TOKEN': JSON.stringify(env.VITE_MAPKITJS_TOKEN),
    },
    build: {
      outDir: 'build',
      // generate manifest.json in outDir
      manifest: true,
    },
    plugins: [
      react(),
      viteTsconfigPaths(),
      svgrPlugin(),
      eslint(),
      VitePWA({
        registerType: 'autoUpdate',
      }),
      checker({
        typescript: true,
      }),
    ],
  };
});
