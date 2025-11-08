import { defineConfig, loadEnv } from 'vite';
import { checker } from 'vite-plugin-checker';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
const preInitEnvSchema = z.object({
    MAPKIT_JS_TEAM_ID: z.string(),
    MAPKIT_JS_KEY_ID: z.string(),
    MAPKIT_JS_AUTH_KEY: z.string(),
    MAPKIT_JS_TTL: z.coerce.number().default(31_536_000), // 1 year
    MAPKIT_ALLOWED_ORIGINS: z
        .string()
        .default('')
        .transform((origins) =>
            process.env.VERCEL_URL !== undefined ? origins + ',' + process.env.VERCEL_URL : origins,
        ),
});
const manifestForPlugin: Partial<VitePWAOptions> = {
    registerType: 'prompt',
    includeAssets: ['favicon.ico', '/favicons/apple-touch-icon.png'],
    manifest: {
        short_name: 'CMUEats',
        name: 'CMUEats',
        icons: [
            {
                src: '/favicons/android-chrome-192x192.png',
                type: 'image/png',
                sizes: '192x192',
                purpose: 'any',
            },
            {
                src: '/favicons/android-chrome-512x512.png',
                type: 'image/png',
                sizes: '512x512',
                purpose: 'any',
            },
            {
                src: '/favicons/android-chrome-192x192-maskable.png',
                type: 'image/png',
                sizes: '192x192',
                purpose: 'maskable',
            },
            {
                src: '/favicons/android-chrome-512x512-maskable.png',
                type: 'image/png',
                sizes: '512x512',
                purpose: 'maskable',
            },
        ],
        scope: '/',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
    },
};

export default defineConfig(({ command, mode }) => {
    const parsedResult = preInitEnvSchema.safeParse(loadEnv(mode, process.cwd(), ''));
    if (parsedResult.error) {
        console.error(
            'Missing one or more .env variables! Make sure you have a .env file locally.',
            parsedResult.error,
        );
        process.exit(1);
    }
    const env = parsedResult.data;

    const iat = Date.now() / 1000;
    const payload = {
        iat,
        exp: iat + env.MAPKIT_JS_TTL,
        iss: env.MAPKIT_JS_TEAM_ID,
        origin: env.MAPKIT_ALLOWED_ORIGINS,
    };

    const header = {
        typ: 'JWT',
        alg: 'ES256',
        kid: env.MAPKIT_JS_KEY_ID,
    };

    try {
        const token = jwt.sign(payload, atob(env.MAPKIT_JS_AUTH_KEY), { header });
        // eslint-disable-next-line no-console
        console.info({
            title: 'MapKit JS token generated successfully',
            summary: `Origin: ${env.MAPKIT_ALLOWED_ORIGINS}, expires in ${env.MAPKIT_JS_TTL} seconds.`,
            text: `process.env.VITE_AUTO_GENERATED_MAPKITJS_TOKEN = '${token}';`,
        });
        process.env.VITE_AUTO_GENERATED_MAPKITJS_TOKEN = token;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    return {
        plugins: [
            react(),
            viteTsconfigPaths(),
            svgrPlugin(),
            VitePWA({
                // WARNING! Removing this library means that all clients with the VitePWA service worker installed *will never have it uninstalled*. (see https://github.com/ScottyLabs/cmueats/pull/642 for more details)
                manifest: manifestForPlugin,
                registerType: 'autoUpdate',
                // Enables autoupdate (uses new version after user quits and reloads app)
                workbox: {
                    cleanupOutdatedCaches: true,
                    skipWaiting: true,
                },
                selfDestroying: true, // remove previously-registered service worker (if it exists)
            }),
            checker({
                typescript: true,
            }),
        ],
        server: {
            proxy: {
                '/api/cmu-maps': {
                    target: 'https://rust.api.maps.scottylabs.org',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/cmu-maps/, ''),
                    secure: true,
                },
            },
        },
    };
});
