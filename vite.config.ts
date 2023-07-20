import { defineConfig, loadEnv } from 'vite';
import { checker } from 'vite-plugin-checker';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

const manifestForPlugin: Partial<VitePWAOptions> = {
	registerType: "prompt",
	includeAssets: ["favicon.ico", "/favicons/apple-touch-icon.png"],
	manifest: {
      "short_name": "CMUEats",
      "name": "CMUEats",
      "icons": [
        {
          "src": "/favicons/android-chrome-192x192.png",
          "type": "image/png",
          "sizes": "192x192",
          "purpose": "any"
        },
        {
          "src": "/favicons/android-chrome-512x512.png",
          "type": "image/png",
          "sizes": "512x512",
          "purpose": "any"
        },
        {
          "src": "/favicons/android-chrome-192x192-maskable.png",
          "type": "image/png",
          "sizes": "192x192",
          "purpose": "maskable"
        },
        {
          "src": "/favicons/android-chrome-512x512-maskable.png",
          "type": "image/png",
          "sizes": "512x512",
          "purpose": "maskable"
        }
      ],
      "scope": "/",
      "start_url": "/",
      "display": "minimal-ui",
      "theme_color": "#000000",
      "background_color": "#ffffff"
  },
};

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.VITE_MAPKITJS_TOKEN': JSON.stringify(env.VITE_MAPKITJS_TOKEN),
    },
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      viteTsconfigPaths(),
      svgrPlugin(),
      eslint(),
      VitePWA({
        manifest: manifestForPlugin,
        registerType: 'autoUpdate',
        // Enables autoupdate (uses new version after user quits and reloads app)
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
        },
      }),
      checker({
        typescript: true,
      }),
    ],
  };
});
