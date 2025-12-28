import { z } from 'zod';

const envSchema = z.object({
    VITE_API_URL: z.any().transform(() => '/api'),
    VITE_POSTHOG_KEY: z.string().optional(),
    VITE_AUTO_GENERATED_MAPKITJS_TOKEN: z.string(),
});

// see preInitEnvSchema in vite.config.ts for variables needed to generate AUTO_GENERATED_VITE_MAPKITJS_TOKEN
const env = envSchema.parse(import.meta.env);
export default env;
