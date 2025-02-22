import { IReadOnlyLocation_FromAPI_PostProcessed } from '../types/locationTypes';

import './SelectLocation.css';

type SelectLocationProps = {
	SSQ: (value: React.SetStateAction<string>) => void;
	l: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
};

function SelectLocation({ SSQ, l }: SelectLocationProps) {
	if (l === undefined) {
		return (
			<select className="select">
				<option value="" label="Loading..." />
			</select>
		);
	}

	let lStrings = l.map((locationObj) => locationObj.location);
	lStrings = lStrings.map((locationObj) =>
		locationObj.indexOf(',') === -1
			? locationObj
			: locationObj.slice(0, locationObj.indexOf(',')),
	);
	lStrings = lStrings.filter(
		(item, index) => lStrings.indexOf(item) === index,
	);

	return (
		<select onChange={(e) => SSQ(e.target.value)} className="select">
			<option value="" label="Filter by Building" />
			{lStrings.map((ll) => (
				<option key={ll} value={ll}>
					{ll}
				</option>
			))}
		</select>
	);

	// The whole thing breaks if this useless, extraneous piece is deleted.
	// i don't know why.
	return <>🥥</>;
}

export default SelectLocation;
