import { ILocation_Full } from '../types/locationTypes';
import css from './SelectLocation.module.css';

type SelectLocationProps = {
    setLocationFilterQuery: React.Dispatch<string>;
    locations: ILocation_Full[] | undefined;
};

function getPrimaryLocation(locationString: string) {
    return locationString.indexOf(',') === -1 ? locationString : locationString.slice(0, locationString.indexOf(','));
}

function SelectLocation({ setLocationFilterQuery, locations }: SelectLocationProps) {
    if (locations === undefined) {
        return (
            <select className={css.select}>
                {/* Keep label the same as the default option below to reduce loading jank */}
                <option value="" label="Filter by Building" />
            </select>
        );
    }

    let locationStrings = locations.map((locationObj) => locationObj.location);
    locationStrings = locations.map((locationObj) => getPrimaryLocation(locationObj.location));

    const dedeupedLocationStrings = [...new Set(locationStrings)];

    return (
        <select onChange={(e) => setLocationFilterQuery(e.target.value)} className={css.select}>
            <option value="" key="Filter by Building" label="Filter by Building" />
            {dedeupedLocationStrings.map((location) => (
                <option key={location} value={location}>
                    {location}
                </option>
            ))}
        </select>
    );
}

export default SelectLocation;
