import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
// import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { ThemeProvider } from './ThemeProvider';
import env from './env';

// registerSW({ immediate: true });
posthog.init(env.VITE_POSTHOG_KEY || '', {
    person_profiles: 'identified_only',
});

const rootElement = document.getElementById('root');

if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <PostHogProvider client={posthog}>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </PostHogProvider>
        </React.StrictMode>,
    );
}
