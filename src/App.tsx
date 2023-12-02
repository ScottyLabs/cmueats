import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Navbar from './components/Navbar';
import ListPage from './pages/ListPage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';
import queryLocations from './util/queryLocations';
import './App.css';

function App() {
	// Load locations
	const { data, status } = useQuery({
		refetchInterval: 1.5 * 60 * 1000, // every 1.5 minutes
		queryKey: ['locationDatra'],
		queryFn: queryLocations,
	});

	// Auto-refresh the page when the user goes online after previously being offline
	useEffect(() => {
		function handleOnline() {
			if (navigator.onLine) {
				// Refresh the page
				window.location.reload();
			}
		}

		window.addEventListener('online', handleOnline);

		return () => window.removeEventListener('online', handleOnline);
	}, []);

	return (
		<React.StrictMode>
			<BrowserRouter>
				<div className="App">
					<div className="MainContent">
						<Routes>
							<Route
								path="/"
								element={
									<ListPage
										locations={data || []}
										loading={status === 'pending'}
									/>
								}
							/>
							<Route
								path="/map"
								element={<MapPage locations={data} />}
							/>
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</div>
					<Navbar />
				</div>
			</BrowserRouter>
		</React.StrictMode>
	);
}

export default App;
