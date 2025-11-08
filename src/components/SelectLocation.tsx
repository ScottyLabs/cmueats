import { IReadOnlyLocation_FromAPI_PostProcessed } from '../types/locationTypes';

import './SelectLocation.css';

type SelectLocationProps = {
    setLocationFilterQuery: React.Dispatch<string>;
    locations: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
};

function getPrimaryLocation(locationString: string) {
    return locationString.indexOf(',') === -1 ? locationString : locationString.slice(0, locationString.indexOf(','));
}

function SelectLocation({ setLocationFilterQuery, locations }: SelectLocationProps) {
    if (locations === undefined) {
        return (
            <div className="filter-container">
                <span className="filter-label">Filter by building:</span>
                <select className="select">
                    <option value="">None</option>
                </select>
            </div>
        );
    }

    let locationStrings = locations.map((locationObj) => locationObj.location);
    locationStrings = locations.map((locationObj) => getPrimaryLocation(locationObj.location));

    const dedeupedLocationStrings = [...new Set(locationStrings)];

    return (
        <div className="filter-container">
            <span className="filter-label">Filter by building:</span>
            <select onChange={(e) => setLocationFilterQuery(e.target.value)} className="select">
                <option value="">None</option>
                {dedeupedLocationStrings.map((location) => (
                    <option key={location} value={location}>
                        {location}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectLocation;
