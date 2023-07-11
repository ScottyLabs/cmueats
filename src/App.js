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
		queryLocations().then((parsedLocations) => {
			if (parsedLocations != null) {
				setLocations(parsedLocations);
			}
		});
	}, []);

	return (
		<React.StrictMode>
			<BrowserRouter>
				<div className="App">
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
			</BrowserRouter>
		</React.StrictMode>
	);
}

export default App;
