import { useEffect, useMemo, useRef, useState } from 'react';
import { ILocation_Full } from '../types/locationTypes';
import css from './SelectLocation.module.css';
import { Filter } from 'lucide-react';

type SelectLocationProps = {
    setLocationFilterQuery: React.Dispatch<string>;
    locations: ILocation_Full[] | undefined;
};

function getPrimaryLocation(locationString: string) {
    return locationString.indexOf(',') === -1 ? locationString : locationString.slice(0, locationString.indexOf(','));
}

function SelectLocation({ setLocationFilterQuery, locations }: SelectLocationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const controlRef = useRef<HTMLDivElement>(null);

    const dedupedLocationStrings = useMemo(() => {
        if (locations === undefined) {
            return [];
        }

        const locationStrings = locations.map((locationObj) => getPrimaryLocation(locationObj.location));
        return [...new Set(locationStrings)];
    }, [locations]);

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (controlRef.current !== null && !controlRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        window.addEventListener('mousedown', handlePointerDown);
        return () => window.removeEventListener('mousedown', handlePointerDown);
    }, []);

    function selectLocation(location: string) {
        setSelectedLocation(location);
        setLocationFilterQuery(location);
        setIsOpen(false);
    }

    return (
        <div className={css.control} ref={controlRef}>
            <button
                type="button"
                className={css.triggerButton}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Filter by Building"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <Filter size={22} />
            </button>
            {isOpen ? (
                <div className={css.dropdown} role="listbox" aria-label="Filter by Building">
                    <button
                        type="button"
                        className={`${css.dropdownItem} ${selectedLocation === '' ? css.dropdownItemActive : ''}`}
                        onClick={() => selectLocation('')}
                        role="option"
                        aria-selected={selectedLocation === ''}
                    >
                        Filter by Building
                    </button>
                    {dedupedLocationStrings.map((location) => (
                        <button
                            key={location}
                            type="button"
                            className={`${css.dropdownItem} ${selectedLocation === location ? css.dropdownItemActive : ''}`}
                            onClick={() => selectLocation(location)}
                            role="option"
                            aria-selected={selectedLocation === location}
                        >
                            {location}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export default SelectLocation;
