import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import ListPage from './pages/ListPage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';
import queryLocations from './util/queryLocations';
import './App.css';

function App() {
	// Load locations
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		queryLocations().then((parsedLocations: $TSFixMe) => {
			if (parsedLocations != null) {
				setLocations(parsedLocations);
			}
		});
	}, []);

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
								element={<ListPage locations={locations} />}
							/>
							<Route
								path="/map"
								element={<MapPage locations={locations} />}
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
