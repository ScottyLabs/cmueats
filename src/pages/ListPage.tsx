import { Typography, Grid, Alert, styled } from '@mui/material';
import { useEffect, useMemo, useState, useLayoutEffect } from 'react';
import EateryCard from '../components/EateryCard';
import NoResultsError from '../components/NoResultsError';
import getGreeting from '../util/greeting';
import './ListPage.css';

import { Location } from '../interfaces';

function ListPage({ locations }: $TSFixMe) {
	const greeting = useMemo(() => getGreeting(), []);

	// Search query processing
	const [searchQuery, setSearchQuery] = useState('');
	const handleSearchQueryChange = (e: $TSFixMe) =>
		setSearchQuery(e.target.value);

	const [filteredLocations, setFilteredLocations] = useState([]);
	useLayoutEffect(() => {
		const filteredSearchQuery = searchQuery.trim().toLowerCase();

		setFilteredLocations(
			filteredSearchQuery.length === 0
				? locations
				: locations.filter(
						({ name, location, shortDescription }: $TSFixMe) =>
							name.toLowerCase().includes(filteredSearchQuery) ||
							location
								.toLowerCase()
								.includes(filteredSearchQuery) ||
							shortDescription
								.toLowerCase()
								.includes(filteredSearchQuery),
				  ),
		);
	}, [searchQuery, locations]);

	const openLocations = filteredLocations.filter(
		(location: Location) => location.isOpen && !location.changesSoon,
	);
	const closesSoonLocations = filteredLocations.filter(
		(location: Location) => location.isOpen && location.changesSoon,
	);
	const closedLocations = filteredLocations.filter(
		(location: Location) =>
			!location.isOpen &&
			!location.changesSoon &&
			!location.closedTemporarily,
	);
	const closedTemporarilyLocations = filteredLocations.filter(
		(location: Location) =>
			!location.isOpen &&
			!location.changesSoon &&
			location.closedTemporarily,
	);
	const opensSoonLocations = filteredLocations.filter(
		(location: Location) => !location.isOpen && location.changesSoon,
	);

	// const [showAlert, setShowAlert] = useState(true);
	const [showOfflineAlert, setShowOfflineAlert] = useState(!navigator.onLine);

	// Load the search query from the URL, if any
	useEffect(() => {
		const urlQuery = new URLSearchParams(window.location.search).get(
			'search',
		);
		if (urlQuery) {
			setSearchQuery(urlQuery);
		}
	}, []);

	// Monitor for the user being online
	useEffect(() => {
		const handleOnlineStatus = () => {
			setShowOfflineAlert(!navigator.onLine);
		};

		window.addEventListener('online', handleOnlineStatus);
		window.addEventListener('offline', handleOnlineStatus);

		return () => {
			window.removeEventListener('online', handleOnlineStatus);
			window.removeEventListener('offline', handleOnlineStatus);
		};
	}, []);

	// Typography
	const HeaderText = styled(Typography)({
		color: 'white',
		padding: 0,
		fontFamily:
			'"Zilla Slab", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
			'"Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", ' +
			'"Droid Sans", "Helvetica Neue", sans-serif',
		fontWeight: 800,
		fontSize: '3em',
	});

	const LogoText = styled(Typography)({
		color: '#dd3c18',
		padding: 0,
		fontFamily:
			'"Zilla Slab", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
			'"Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", ' +
			'"Droid Sans", "Helvetica Neue", sans-serif',
		fontWeight: 800,
	});

	const FooterText = styled(Typography)({
		color: 'white',
		marginBottom: 20,
		fontSize: 16,
	});

	const StyledAlert = styled(Alert)({
		backgroundColor: '#23272a',
		color: '#ffffff',
	});

	return (
		<div className="ListPage">
			{/*  showAlert &&
      <StyledAlert severity="info" className="announcement" onClose={() => setShowAlert(false)}>
        🚧 [Issue Description]
        Please remain patient while we work on a fix. Thank you. 🚧
      </StyledAlert>  */}
			{showOfflineAlert && (
				<StyledAlert
					severity="info"
					className="announcement"
					onClose={() => setShowOfflineAlert(false)}
				>
					🚫🌐 We are temporarily unable to provide the latest
					available dining information or the map while you are
					offline. We apologize for any inconvenience. 🌐🚫
				</StyledAlert>
			)}
			<div className="Container">
				<header className="Locations-header">
					<HeaderText variant="h3">{greeting}</HeaderText>
					<input
						className="Locations-search"
						type="search"
						value={searchQuery}
						onChange={handleSearchQueryChange}
						placeholder="Search"
					/>
				</header>

				{filteredLocations.length === 0 && locations.length !== 0 && (
					<NoResultsError onClear={() => setSearchQuery('')} />
				)}

				<Grid container spacing={2}>
					{openLocations
						.sort(
							(location1: Location, location2: Location) =>
								location2.timeUntilClosed -
								location1.timeUntilClosed,
						)
						.map((location: Location) => (
							<EateryCard
								location={location}
								key={location.conceptId}
							/>
						))}
					{closesSoonLocations
						.sort(
							(location1: Location, location2: Location) =>
								location2.timeUntilClosed -
								location1.timeUntilClosed,
						)
						.map((location: Location) => (
							<EateryCard
								location={location}
								key={location.conceptId}
							/>
						))}
					{opensSoonLocations
						.sort(
							(location1: Location, location2: Location) =>
								location1.timeUntilOpen -
								location2.timeUntilOpen,
						)
						.map((location: Location) => (
							<EateryCard
								location={location}
								key={location.conceptId}
							/>
						))}
					{closedLocations
						.sort(
							(location1: Location, location2: Location) =>
								location1.timeUntilOpen -
								location2.timeUntilOpen,
						)
						.map((location: Location) => (
							<EateryCard
								location={location}
								key={location.conceptId}
							/>
						))}
					{closedTemporarilyLocations
						.sort(
							(location1: Location, location2: Location) =>
								location1.timeUntilOpen -
								location2.timeUntilOpen,
						)
						.map((location: Location) => (
							<EateryCard
								location={location}
								key={location.conceptId}
							/>
						))}
				</Grid>
			</div>
			<footer className="footer">
				<FooterText>
					All times displayed in Pittsburgh local time (ET).
				</FooterText>
				{/* eslint-disable */}
				<FooterText>
					Contact{' '}
					<a
						href={'mailto:jaisal.patel45@gmail.com'}
						style={{ color: 'white' }}
					>
						Jaisal
					</a>
					,{' '}
					<a
						href={'mailto:jmacera@andrew.cmu.edu'}
						style={{ color: 'white' }}
					>
						Josef
					</a>
                                        ,{' '}or{' '}
					<a
						href={'mailto:ahusun@andrew.cmu.edu'}
						style={{ color: 'white' }}
					>
						Aaron
					</a>{' '}
					with any problems.
				</FooterText>
				{/* eslint-enable */}
				<LogoText variant="h4">
					cmu<span style={{ color: '#19b875' }}>:eats</span>
				</LogoText>
			</footer>
		</div>
	);
}

export default ListPage;
