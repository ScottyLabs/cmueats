import { IReadOnlyLocation_FromAPI_PostProcessed } from '../types/locationTypes';

import './SelectLocation.css';

type SelectLocationProps = {
	setlocationFilterSearchQuery: React.Dispatch<React.SetStateAction<string>>;
	locations: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
};

function getPrimaryLocation(locationString: string) {
	return locationString.indexOf(',') === -1
		? locationString
		: locationString.slice(0, locationString.indexOf(','));
}

function SelectLocation({
	setlocationFilterSearchQuery,
	locations,
}: SelectLocationProps) {
	if (locations === undefined) {
		return (
			<select className="select">
				<option value="" label="Loading..." />
			</select>
		);
	}

	let locationStrings = locations.map((locationObj) => locationObj.location);
	locationStrings = locations.map((locationObj) =>
		getPrimaryLocation(locationObj.location),
	);

	const dedeupedLocationStrings = [...new Set(locationStrings)];

	return (
		<select
			onChange={(e) => setlocationFilterSearchQuery(e.target.value)}
			className="select"
		>
			<option value="" key="All Buildings" label="All Buildings" />
			{dedeupedLocationStrings.map((location) => (
				<option key={location} value={location}>
					{location}
				</option>
			))}
		</select>
	);
}

export default SelectLocation;
