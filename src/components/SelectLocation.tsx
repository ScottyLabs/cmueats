import { useRef } from 'react';
import { Filter } from 'lucide-react';
import { ILocation_Full } from '../types/locationTypes';
import css from './SelectDropdown.module.css';

type SelectLocationProps = {
    setLocationFilterQuery: React.Dispatch<string>;
    locations: ILocation_Full[] | undefined;
};

function getPrimaryLocation(locationString: string) {
    return locationString.indexOf(',') === -1 ? locationString : locationString.slice(0, locationString.indexOf(','));
}

function SelectLocation({ setLocationFilterQuery, locations }: SelectLocationProps) {
    const selectRef = useRef<HTMLSelectElement>(null);
    const deduplicatedLocations = locations
        ? [...new Set(locations.map((loc) => getPrimaryLocation(loc.location)))]
        : [];

    return (
        <div className={css.container}>
            <div className={css['icon-div']}>
                <Filter />
            </div>
            <select ref={selectRef} onChange={(e) => setLocationFilterQuery(e.target.value)} className={css.select}>
                <option value="" key="All Buildings" label="All Buildings" />
                {deduplicatedLocations.map((location) => (
                    <option key={location} value={location}>
                        {location}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectLocation;
