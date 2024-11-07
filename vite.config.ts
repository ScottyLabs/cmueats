import million from 'million/compiler';
import { defineConfig, loadEnv } from 'vite';
import { checker } from 'vite-plugin-checker';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import jwt from 'jsonwebtoken';


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
      "display": "standalone",
      "theme_color": "#ffffff",
      "background_color": "#ffffff"
  },
};

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const teamId = env.MAPKIT_JS_TEAM_ID;
  const keyId = env.MAPKIT_JS_KEY_ID;
  const authKey = env.MAPKIT_JS_AUTH_KEY;
  const tokenEnvVariable =
    env.MAPKIT_JS_TOKEN_ENV_VARIABLE || 'MAPKIT_JS_TOKEN';
  const ttl = +(env.MAPKIT_JS_TTL || 31_536_000); // 1 year
  const origin = env.MAPKIT_JS_ORIGIN || env.DEPLOY_PRIME_URL;
  const posthog = env.REACT_APP_PUBLIC_POSTHOG_KEY;

  if (!teamId || !keyId || !authKey || !tokenEnvVariable || !ttl) {
    console.error('Missing one or more .env variables! Make sure you have a .env file locally.');
    process.exit(1);
  }

  const iat = Date.now() / 1000;
  const payload = {
    iat,
    exp: iat + ttl,
    iss: teamId,
    origin,
  };

  const header = {
    typ: 'JWT',
    alg: 'ES256',
    kid: keyId,
  };

  try {
    const token = jwt.sign(payload, atob(authKey), { header });
    env[tokenEnvVariable] = token;
    // eslint-disable-next-line no-console
    console.info({
      title: 'MapKit JS token generated successfully',
      summary: `Origin: ${origin}, expires in ${ttl} seconds.`,
      text: `process.env.${tokenEnvVariable} = '${token}';`,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }


  return {
    define: {
      'process.env.VITE_MAPKITJS_TOKEN': JSON.stringify(env[tokenEnvVariable]),
      'process.env.REACT_APP_PUBLIC_POSTHOG_KEY': JSON.stringify(posthog),
    },
    plugins: [
      million.vite({ auto: true }),
      react(),
      viteTsconfigPaths(),
      svgrPlugin(),
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
