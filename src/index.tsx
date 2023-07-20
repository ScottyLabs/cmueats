import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

import App from './App';

// Refreshes (comment out code in development, so doesn't refresh to black screen)
const updateSW = registerSW({
	onNeedRefresh() {
		updateSW(true);
	},
});

const rootElement = document.getElementById('root');

if (rootElement) {
	createRoot(rootElement).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}
