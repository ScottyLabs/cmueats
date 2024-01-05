import { Typography, Grid, Alert, styled } from '@mui/material';
import { useEffect, useMemo, useState, useLayoutEffect } from 'react';
import EateryCard from '../components/EateryCard';
import NoResultsError from '../components/NoResultsError';
import getGreeting from '../util/greeting';
import './ListPage.css';
import { IExtendedLocationData, LocationState } from '../types/locationTypes';
import assert from '../util/assert';

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
const ErrorText = styled(Typography)({
	color: 'white',
	padding: 0,
	fontFamily:
		'"Zilla Slab", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
		'"Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", ' +
		'"Droid Sans", "Helvetica Neue", sans-serif',
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

function ListPage({
	locations,
}: {
	locations: IExtendedLocationData[] | undefined;
}) {
	const greeting = useMemo(() => getGreeting(), []);

	// Search query processing
	const [searchQuery, setSearchQuery] = useState('');

	const [filteredLocations, setFilteredLocations] = useState<
		IExtendedLocationData[]
	>([]);

	useLayoutEffect(() => {
		if (locations === undefined) return;
		const filteredSearchQuery = searchQuery.trim().toLowerCase();

		setFilteredLocations(
			filteredSearchQuery.length === 0
				? locations
				: locations.filter(
						({ name, location, shortDescription }) =>
							name.toLowerCase().includes(filteredSearchQuery) ||
							location
								.toLowerCase()
								.includes(filteredSearchQuery) ||
							(shortDescription &&
								shortDescription
									.toLowerCase()
									.includes(filteredSearchQuery)),
				  ),
		);
	}, [searchQuery, locations]);

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
					<HeaderText variant="h3">
						{locations === undefined ? 'Loading...' : greeting}
					</HeaderText>
					<input
						className="Locations-search"
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search"
					/>
				</header>
				{(() => {
					if (locations === undefined) return undefined; // still loading
					if (locations.length === 0)
						// Okay we're assuming that an empty array means something has gone awry - there's no way there's no data, right?
						return (
							<ErrorText variant="h4">
								Oops! We received an invalid API response (or no
								data at all). Please contact us because we
								definitely messed something up on the backend.
							</ErrorText>
						);
					if (filteredLocations.length === 0)
						return (
							<NoResultsError
								onClear={() => setSearchQuery('')}
							/>
						);
					return (
						<Grid container spacing={2}>
							{filteredLocations
								.sort((l1, l2) => {
									const state1 = l1.locationState;
									const state2 = l2.locationState;
									if (state1 !== state2)
										return state1 - state2;
									// this if statement is janky but otherwise TS won't
									// realize that the timeUntil property exists on both l1 and l2
									if (
										l1.closedLongTerm ||
										l2.closedLongTerm
									) {
										assert(
											l1.closedLongTerm &&
												l2.closedLongTerm,
										);
										return l1.name.localeCompare(l2.name);
									}
									// flip sorting order if locations are both open or opening soon
									return (
										(state1 === LocationState.OPEN ||
										state1 === LocationState.OPENS_SOON
											? -1
											: 1) *
										(l1.timeUntil - l2.timeUntil)
									);
								})
								.map((location) => (
									<EateryCard
										location={location}
										key={location.conceptId}
									/>
								))}
						</Grid>
					);
				})()}
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
					, or{' '}
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
