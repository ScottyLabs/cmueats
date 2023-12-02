import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient();

import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
	createRoot(rootElement).render(
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</React.StrictMode>,
	);
}
