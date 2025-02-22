import { IReadOnlyLocation_FromAPI_PostProcessed } from '../types/locationTypes';

import './SelectLocation.css';

type SelectLocationProps = {
	setSearchQuery: (value: React.SetStateAction<string>) => void;
	locations: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
};

function SelectLocation({ setSearchQuery, locations }: SelectLocationProps) {
	if (locations === undefined) {
		return (
			<select className="select">
				<option value="" label="Loading..." />
			</select>
		);
	}

	let locationStringsList = locations.map(
		(locationObj) => locationObj.location,
	);
	locationStringsList = locationStringsList.map((locationObj) =>
		locationObj.indexOf(',') === -1
			? locationObj
			: locationObj.slice(0, locationObj.indexOf(',')),
	);
	const locationStrings = Array.from(new Set(locationStringsList));

	return (
		<select
			onChange={(e) => setSearchQuery(e.target.value)}
			className="select"
		>
			<option value="" label="Filter by Building" />
			{locationStrings.map((location) => (
				<option key={location} value={location}>
					{location}
				</option>
			))}
		</select>
	);

	return <>BUG: breaks if removed</>;
}

export default SelectLocation;
