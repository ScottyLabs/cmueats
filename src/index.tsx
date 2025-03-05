import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import App from './App';
import MIKU_DAY from './util/constants';

posthog.init(process.env.REACT_APP_PUBLIC_POSTHOG_KEY || '', {
	person_profiles: 'identified_only',
});

const rootElement = document.getElementById('root');

if (MIKU_DAY) {
	document.documentElement.classList.add('miku');
}
if (rootElement) {
	createRoot(rootElement).render(
		<React.StrictMode>
			<PostHogProvider client={posthog}>
				<App />
			</PostHogProvider>
		</React.StrictMode>,
	);
}
