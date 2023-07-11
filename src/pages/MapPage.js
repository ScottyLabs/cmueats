import React, { useMemo, useState, useRef } from 'react';
import {
	Map,
	Marker,
	ColorScheme,
	PointOfInterestCategory,
} from 'mapkit-react';
import { CSSTransition } from 'react-transition-group';
import EateryCard from '../components/EateryCard';
import './MapPage.css';

const token = process.env.REACT_APP_MAPKITJS_TOKEN;

function abbreviate(longName) {
	const importantPart = longName.split(/(-|\(|'|&| at )/i)[0].trim();
	return importantPart
		.split(' ')
		.map((word) => word.charAt(0))
		.join('');
}

function MapPage({ locations }) {
	const [selectedLocationIndex, setSelectedLocationIndex] = useState(null);
	const [isDrawerVisible, setDrawerVisible] = useState(false);
	const drawerRef = useRef(null);

	const cameraBoundary = useMemo(
		() => ({
			centerLatitude: 40.444,
			centerLongitude: -79.945,
			latitudeDelta: 0.006,
			longitudeDelta: 0.01,
		}),
		[],
	);

	const initialRegion = useMemo(
		() => ({
			centerLatitude: 40.44316701238923,
			centerLongitude: -79.9431147637379,
			latitudeDelta: 0.006337455593801167,
			longitudeDelta: 0.011960061265583022,
		}),
		[],
	);

	return (
		<div className="MapPage">
			<Map
				token={token}
				colorScheme={ColorScheme.Dark}
				initialRegion={initialRegion}
				excludedPOICategories={[PointOfInterestCategory.Restaurant]}
				cameraBoundary={cameraBoundary}
				minCameraDistance={100}
				maxCameraDistance={1000}
				showsUserLocationControl={true}
				allowWheelToZoom={true}
			>
				{locations.map((location, locationIndex) => (
					<Marker
						key={location.conceptId}
						latitude={location.coordinates.lat}
						longitude={location.coordinates.lng}
						color={location.isOpen ? '#69bb36' : '#ff5b40'}
						glyphText={abbreviate(location.name)}
						onSelect={() => {
							setSelectedLocationIndex(locationIndex);
							setDrawerVisible(true);
						}}
						onDeselect={() => {
							if (selectedLocationIndex === locationIndex) {
								setDrawerVisible(false);
							}
						}}
					/>
				))}
			</Map>

			<CSSTransition
				classNames="DrawerTransition"
				timeout={300}
				in={isDrawerVisible}
				mountOnEnter
				unmountOnExit
				nodeRef={drawerRef}
			>
				<div className="MapDrawer" ref={drawerRef}>
					<EateryCard
						location={locations[selectedLocationIndex] || {}}
					/>
				</div>
			</CSSTransition>
		</div>
	);
}

export default MapPage;
