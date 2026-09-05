import { Filter } from 'lucide-react';
import { ILocation_Full } from '../types/locationTypes';
import css from './SelectDropdown.module.css';

type SelectLocationProps = {
    setLocationFilterQuery: React.Dispatch<string>;
    locations: ILocation_Full[] | undefined;
};

function getPrimaryLocation(locationString: string) {
    return locationString.split(',', 1)[0];
}

function SelectLocation({ setLocationFilterQuery, locations }: SelectLocationProps) {
    const deduplicatedBuildingNames = locations
        ? [...new Set(locations.map((loc) => getPrimaryLocation(loc.location)))]
        : [];

    return (
        <div className={css.container}>
            <div className={css['icon-div']}>
                <Filter />
            </div>
            <select onChange={(e) => setLocationFilterQuery(e.target.value)} className={css.select}>
                <option value="" key="All Buildings" label="All Buildings" />
                {deduplicatedBuildingNames.map((location) => (
                    <option key={location} value={location}>
                        {location}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectLocation;
