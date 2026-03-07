import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import { ThemeProvider } from './ThemeProvider';
import env from './env';
import notifySlack from './util/slack';
import GlobalErrorBoundary from './ErrorFallback';
import { NowContextProvider } from './contexts/NowContext';
import { queryClient } from './api';
import { IsMobileContextProvider } from './contexts/IsMobileContext';

posthog.init(env.VITE_POSTHOG_KEY || '', {
    person_profiles: 'identified_only',
});

// error handling
// catches synchronous errors
window.addEventListener('error', (event) => {
    notifySlack(`<!channel> ${event.error?.message}\n${event.error?.stack}`).catch(() => {}); // ignore failure to prevent infinite loop
});

// catches errors raised in try-catch blocks
window.addEventListener('unhandledrejection', (er) =>
    notifySlack(`<!channel> ${er.reason}\n${er.reason?.stack}`).catch(() => {}),
); // ignore failure to prevent infinite loop
const rootElement = document.getElementById('root');

if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <GlobalErrorBoundary>
                <PostHogProvider client={posthog}>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider>
                            <NowContextProvider>
                                <IsMobileContextProvider>
                                    <App />
                                </IsMobileContextProvider>
                            </NowContextProvider>
                        </ThemeProvider>
                        <ReactQueryDevtools position="left" buttonPosition="bottom-left" />
                    </QueryClientProvider>
                </PostHogProvider>
            </GlobalErrorBoundary>
        </React.StrictMode>,
    );
}
