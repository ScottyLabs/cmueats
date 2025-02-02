import { Typography, Grid, Alert, styled } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import Fuse, { IFuseOptions } from 'fuse.js';
import EateryCard from '../components/EateryCard';
import EateryCardSkeleton from '../components/EateryCardSkeleton';
import NoResultsError from '../components/NoResultsError';
import getGreeting from '../util/greeting';
import './ListPage.css';
import {
	IReadOnlyLocationExtraDataMap,
	IReadOnlyLocation_PostProcessed,
	LocationState,
} from '../types/locationTypes';
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

function getPittsburghTime() {
	const now = new Date();
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'America/New_York',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short',
	};
	return now.toLocaleString('en-US', options);
}

const FUSE_OPTIONS: IFuseOptions<IReadOnlyLocation_PostProcessed> = {
	// keys to perform the search on
	keys: ['name', 'location', 'shortDescription', 'description'],
	ignoreLocation: true,
	threshold: 0.3,
};

function ListPage({
	extraLocationData,
	locations,
}: {
	extraLocationData?: IReadOnlyLocationExtraDataMap;
	locations?: IReadOnlyLocation_PostProcessed[];
}) {
	const greeting = useMemo(() => getGreeting(new Date().getHours()), []);
	const fuse = useMemo(() => {
		console.log('new fuse', locations);
		return new Fuse(locations ?? [], FUSE_OPTIONS);
	}, [locations]); // only update fuse when the raw data actually changes (we don't care about the status (like time until close) changing)

	const [searchQuery, setSearchQuery] = useState('g');
	const processedSearchQuery = searchQuery.trim().toLowerCase();

	const filteredLocations = useMemo(() => {
		return processedSearchQuery.length === 0
			? (locations ?? [])
			: fuse.search(processedSearchQuery).map((result) => result.item);
	}, [fuse, searchQuery]);

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
						{extraLocationData === undefined
							? 'Loading...'
							: greeting}
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
					if (
						locations === undefined ||
						extraLocationData === undefined
					) {
						// Display skeleton cards while loading
						return (
							<Grid container spacing={2}>
								{/* TODO: find a better solution */}
								{Array(36)
									.fill(null)
									.map((_, index) => index)
									.map((v) => (
										<EateryCardSkeleton key={v} />
									))}
							</Grid>
						);
					}
					if (locations.length === 0)
						return (
							<ErrorText variant="h4">
								Oops! We received an invalid API response (or no
								data at all). If this problem persists, please
								let us know.
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
							{[...filteredLocations]
								.map((location) => ({
									...location,
									...extraLocationData[location.conceptId], // add on our extra data here
								}))
								.sort((location1, location2) => {
									const state1 = location1.locationState;
									const state2 = location2.locationState;
									if (state1 !== state2)
										return state1 - state2;
									// this if statement is janky but otherwise TS won't
									// realize that the timeUntil property exists on both l1 and l2
									if (
										location1.closedLongTerm ||
										location2.closedLongTerm
									) {
										assert(
											location1.closedLongTerm &&
												location2.closedLongTerm,
										);
										return location1.name.localeCompare(
											location2.name,
										);
									}
									// flip sorting order if locations are both open or opening soon
									return (
										(state1 === LocationState.OPEN ||
										state1 === LocationState.OPENS_SOON
											? -1
											: 1) *
										(location1.timeUntil -
											location2.timeUntil)
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
					All times displayed in Pittsburgh local time (
					{getPittsburghTime()}).
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
						href={'mailto:jhurewit@andrew.cmu.edu'}
						style={{ color: 'white' }}
					>
						Jack
					</a>{' '}
					with any problems.
				</FooterText>
				<FooterText>
					Made with ❤️ by{' '}
					<a
						href={'https://scottylabs.org'}
						style={{ color: 'white' }}
					>
						ScottyLabs
					</a>
					.
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
