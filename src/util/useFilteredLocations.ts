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

function getDistanceInMeters(
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number },
) {
    const earthRadiusMeters = 6371000;
    const lat1 = (start.latitude * Math.PI) / 180;
    const lat2 = (end.latitude * Math.PI) / 180;
    const deltaLat = ((end.latitude - start.latitude) * Math.PI) / 180;
    const deltaLng = ((end.longitude - start.longitude) * Math.PI) / 180;
    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMeters * c;
}

function getLocationDistanceFromUser(
    location: ILocation_Full,
    userCoordinates: { latitude: number; longitude: number },
): number | undefined {
    if (location.coordinateLat === null || location.coordinateLng === null) return undefined;
    return getDistanceInMeters(userCoordinates, {
        latitude: location.coordinateLat,
        longitude: location.coordinateLng,
    });
}

function compareLocationsByDistanceWithinState(
    location1: ILocation_Full,
    location2: ILocation_Full,
    userCoordinates: { latitude: number; longitude: number },
) {
    const distance1 = getLocationDistanceFromUser(location1, userCoordinates);
    const distance2 = getLocationDistanceFromUser(location2, userCoordinates);
    if (distance1 === undefined && distance2 === undefined) return compareLocations(location1, location2);
    if (distance1 === undefined) return 1;
    if (distance2 === undefined) return -1;
    if (distance1 !== distance2) return distance1 - distance2;
    return compareLocations(location1, location2);
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

export function useSortedLocations({
    locations,
    sortBy,
    userCoordinates,
}: {
    locations: ILocation_Full[] | undefined;
    sortBy: '' | 'distance';
    userCoordinates: { latitude: number; longitude: number } | null;
}) {
    if (locations === undefined) return undefined;
    if (sortBy === 'distance' && userCoordinates) {
        return [...locations].sort((location1, location2) => {
            const stateComparison = location1.locationState - location2.locationState;
            if (stateComparison !== 0) return stateComparison;
            return compareLocationsByDistanceWithinState(location1, location2, userCoordinates);
        });
    }
    return [...locations].sort(compareLocations); // we make a copy to avoid mutating the original array
}
