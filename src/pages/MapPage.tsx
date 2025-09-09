import { useMemo, useState } from 'react';
import { Map, Marker, ColorScheme, PointOfInterestCategory } from 'mapkit-react';
import { AnimatePresence, motion } from 'motion/react';
import EateryCard from '../components/EateryCard';
import css from './MapPage.module.css';
import {
    IReadOnlyLocation_FromAPI_PostProcessed,
    IReadOnlyLocation_ExtraData_Map,
    IReadOnlyLocation_Combined,
    LocationState,
} from '../types/locationTypes';
import { mapMarkerBackgroundColors, mapMarkerTextColors } from '../constants/colors';
import env from '../env';
import downArrow from '../assets/down-chevron.svg';

function abbreviate(longName: string) {
    const importantPart = longName.split(/(-|\(|'|&| at )/i)[0].trim();
    return importantPart
        .split(' ')
        .map((word) => word.charAt(0))
        .join('');
}

/**
 *
 * @param varString if input is var(XXX), we get back XXX
 * @returns
 */
const stripVarFromString = (varString: string) => varString.match(/var\((.+)\)/)?.[1] ?? '';
type Filters = 'open' | 'closed' | 'onlyPinned';
const filters: {
    [key in Filters]: {
        f: (location: IReadOnlyLocation_Combined, pinnedLocations: Record<string, true>) => boolean;
        text: string;
    };
} = {
    open: {
        f: (location) =>
            location.locationState === LocationState.OPEN ||
            location.locationState === LocationState.CLOSES_SOON ||
            location.locationState === LocationState.OPENS_SOON,
        text: 'open',
    },
    closed: { f: (location) => location.locationState === LocationState.CLOSED, text: 'closed' },
    onlyPinned: { f: (location, pinnedLocations) => pinnedLocations[location.conceptId], text: 'show pinned only' },
};
// filters grouped in a section are ORed together. sections are ANDed together. A section with only one filter is considered to return true when it isn't selected
const filterSections: Filters[][] = [['open', 'closed'], ['onlyPinned']];
function MapPage({
    locations,
    extraLocationData,
    pinnedIds,
    updatePinnedIds,
}: {
    locations: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
    extraLocationData: IReadOnlyLocation_ExtraData_Map | undefined;
    pinnedIds: Record<string, true>;
    updatePinnedIds: (newPinnedIds: Record<string, true>) => void;
}) {
    const [selectedLocation, setSelectedLocation] = useState<IReadOnlyLocation_Combined>();
    const [activeFilters, setActiveFilters] = useState<Filters[]>(['closed', 'open']);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
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
    const derivedRootColors = useMemo(() => window.getComputedStyle(document.body), []);
    const extendedLocationData =
        locations && extraLocationData
            ? locations.map((location) => ({
                  ...location,
                  ...extraLocationData[location.conceptId],
              }))
            : undefined;
    return (
        <div className={css['map-page']}>
            {extendedLocationData && (
                <>
                    <div className={css['filter-container']}>
                        <button
                            className={css['map-filter-button']}
                            type="button"
                            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                        >
                            <span>Filter</span>
                            <img
                                src={downArrow}
                                alt=""
                                style={{ transform: `rotate(${filterDropdownOpen ? 180 : 0}deg)` }}
                            />
                        </button>
                        <motion.div
                            className={css['all-filters']}
                            animate={{ height: filterDropdownOpen ? 'auto' : 0 }}
                        >
                            {filterSections.map((filtersInSection) => (
                                <div className={css['filter-section']}>
                                    {filtersInSection.map((filterName) => {
                                        const isActive = activeFilters.includes(filterName);
                                        return (
                                            <div className={css['filter-button']} key={filterName}>
                                                <input
                                                    type="checkbox"
                                                    name=""
                                                    checked={isActive}
                                                    id={filterName}
                                                    onClick={() => {
                                                        setActiveFilters(
                                                            isActive
                                                                ? activeFilters.filter(
                                                                      (filter) => filter !== filterName,
                                                                  )
                                                                : [...activeFilters, filterName],
                                                        );
                                                    }}
                                                />
                                                <label htmlFor={filterName}>{filters[filterName].text}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <Map
                        token={env.VITE_AUTO_GENERATED_MAPKITJS_TOKEN}
                        colorScheme={ColorScheme.Dark}
                        initialRegion={initialRegion}
                        excludedPOICategories={[PointOfInterestCategory.Restaurant]}
                        cameraBoundary={cameraBoundary}
                        minCameraDistance={100}
                        maxCameraDistance={1000}
                        showsUserLocationControl
                        allowWheelToZoom
                    >
                        {extendedLocationData
                            .filter((location) =>
                                filterSections.every((filtersInSection) => {
                                    const relevantFilters = filtersInSection.filter((filter) =>
                                        activeFilters.includes(filter),
                                    );
                                    return (
                                        (relevantFilters.length === 0 && filtersInSection.length === 1) ||
                                        relevantFilters.some((filter) => filters[filter].f(location, pinnedIds))
                                    );
                                }),
                            )
                            .map((location) => {
                                if (!location.coordinates) return undefined;
                                const bgColor = derivedRootColors.getPropertyValue(
                                    stripVarFromString(mapMarkerBackgroundColors[location.locationState]),
                                ); // mapkit doesn't accept css variables, so we'll go ahead and get the actual color value from :root first
                                const textColor = derivedRootColors.getPropertyValue(
                                    stripVarFromString(mapMarkerTextColors[location.locationState]),
                                );
                                return (
                                    <Marker
                                        key={location.conceptId}
                                        latitude={location.coordinates.lat}
                                        longitude={location.coordinates.lng}
                                        color={bgColor}
                                        glyphColor={textColor}
                                        glyphText={abbreviate(location.name)}
                                        onSelect={() => {
                                            setSelectedLocation(location);
                                        }}
                                        onDeselect={() => {
                                            setSelectedLocation(undefined);
                                        }}
                                    />
                                );
                            })}
                    </Map>
                    <AnimatePresence>
                        {selectedLocation !== undefined && (
                            <motion.div
                                className={css['map-drawer-container']}
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.4, ease: [0.14, 0.9, 0.42, 1.03] }}
                            >
                                <div className={css['map-drawer']}>
                                    <EateryCard
                                        location={selectedLocation}
                                        isPinned={pinnedIds[selectedLocation.conceptId]}
                                        onTogglePin={() => {
                                            const id = selectedLocation.conceptId;
                                            const newPinnedIds = { ...pinnedIds };
                                            if (newPinnedIds[id]) {
                                                delete newPinnedIds[id];
                                            } else {
                                                newPinnedIds[id] = true;
                                            }
                                            updatePinnedIds(newPinnedIds);
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}

export default MapPage;
