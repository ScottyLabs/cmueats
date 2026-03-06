import Fuse, { IFuseOptions } from 'fuse.js';
import { useMemo } from 'react';
import { ILocation_Full, LocationState } from '../types/locationTypes';
import assert from './assert';

const FUSE_OPTIONS: IFuseOptions<ILocation_Full> = {
    // keys to perform the search on
    keys: ['name', 'location', 'shortDescription', 'description'],
    ignoreLocation: true,
    threshold: 0.2,
};

const compareLocations = (location1: ILocation_Full, location2: ILocation_Full) => {
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

export function useSortedLocations({ locations }: { locations: ILocation_Full[] | undefined }) {
    if (locations === undefined) return undefined;
    return [...locations].sort(compareLocations); // we make a copy to avoid mutating the original array
}
