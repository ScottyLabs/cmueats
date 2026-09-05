import Fuse, { IFuseOptions } from 'fuse.js';
import { useMemo } from 'react';
import { ILocation_Full, LocationState } from '../types/locationTypes';
import assert from './assert';

export type SortOption = 'open' | 'distance' | 'rating-highest-open' | 'rating-highest' | 'rating-lowest';

const FUSE_OPTIONS: IFuseOptions<ILocation_Full> = {
    // keys to perform the search on
    keys: ['name', 'location', 'shortDescription', 'description'],
    ignoreLocation: true,
    threshold: 0.2,
};

const compareLocationsByStatus = (location1: ILocation_Full, location2: ILocation_Full) => {
    const state1 = location1.locationState;
    const state2 = location2.locationState;

    if (state1 !== state2) return state1 - state2;

    // this if statement is janky but otherwise TS won't
    // realize that the timeUntil property exists on both l1 and l2
    if (location1.closedLongTerm || location2.closedLongTerm) {
        assert(location1.closedLongTerm && location2.closedLongTerm);
        return location1.name.localeCompare(location2.name);
    }
    if (state1 === LocationState.OPEN || state1 === LocationState.CLOSES_SOON) {
        return location2.minutesUntil - location1.minutesUntil;
    }
    return location1.minutesUntil - location2.minutesUntil;
};

function compareLocationsByDistanceWithinState(location1: ILocation_Full, location2: ILocation_Full) {
    const distance1 = location1.distanceFromUserMeters;
    const distance2 = location2.distanceFromUserMeters;
    if (distance1 === null && distance2 === null) return compareLocationsByStatus(location1, location2);
    if (distance1 === null) return 1;
    if (distance2 === null) return -1;
    if (distance1 !== distance2) return distance1 - distance2;
    return compareLocationsByStatus(location1, location2);
}

export function useFilteredLocations({
    locations,
    searchQuery,
    locationFilterQuery,
}: {
    locations: ILocation_Full[] | undefined;
    searchQuery: string;
    locationFilterQuery: string;
}) {
    const fuse = useMemo(() => new Fuse(locations ?? [], FUSE_OPTIONS), [locations]);
    const processedSearchQuery = searchQuery.trim().toLowerCase();

    const filteredLocations = useMemo(() => {
        const searchResults =
            processedSearchQuery.length === 0
                ? (locations ?? [])
                : fuse.search(processedSearchQuery).map((result) => result.item);

        const locationFilterResults = new Set(fuse.search(locationFilterQuery).map((results) => results.item));

        const intersection =
            locationFilterQuery === ''
                ? searchResults
                : searchResults.filter((item) => locationFilterResults.has(item));

        return locations !== undefined ? intersection : undefined;
    }, [fuse, processedSearchQuery, locations, locationFilterQuery]);
    return filteredLocations;
}

export function sortLocations({ locations, sortBy }: { locations: ILocation_Full[] | undefined; sortBy: SortOption }) {
    if (locations === undefined) return undefined;
    if (sortBy === 'distance') {
        return [...locations].sort((location1, location2) => {
            const stateComparison = location1.locationState - location2.locationState;
            if (stateComparison !== 0) return stateComparison;
            return compareLocationsByDistanceWithinState(location1, location2);
        });
    }
    if (sortBy === 'rating-highest-open' || sortBy === 'rating-highest' || sortBy === 'rating-lowest') {
        return [...locations].sort((location1, location2) => {
            const o1 =
                location1.locationState === LocationState.OPEN || location1.locationState === LocationState.CLOSES_SOON;
            const o2 =
                location2.locationState === LocationState.OPEN || location2.locationState === LocationState.CLOSES_SOON;

            if (sortBy === 'rating-highest-open' && o1 !== o2) {
                return location1.locationState - location2.locationState;
            }

            const r1 = location1.ratingsAvg;
            const r2 = location2.ratingsAvg;

            if (r1 === r2) return compareLocationsByStatus(location1, location2);
            if (r1 === null) return 1;
            if (r2 === null) return -1;

            return sortBy === 'rating-lowest' ? r1 - r2 : r2 - r1;
        });
    }
    return [...locations].sort(compareLocationsByStatus); // we make a copy to avoid mutating the original array
}
