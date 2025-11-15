import Fuse, { IFuseOptions } from 'fuse.js';
import { useMemo } from 'react';
import { IReadOnlyLocation_Combined, IReadOnlyLocation_FromAPI_PostProcessed } from '../types/locationTypes';

const FUSE_OPTIONS: IFuseOptions<IReadOnlyLocation_FromAPI_PostProcessed> = {
    // keys to perform the search on
    keys: ['name', 'location', 'shortDescription', 'description'],
    ignoreLocation: true,
    threshold: 0.2,
};

export default function useFilteredLocations({
    locations,
    searchQuery,
    locationFilterQuery,
}: {
    locations: IReadOnlyLocation_Combined[] | undefined;
    searchQuery: string;
    locationFilterQuery: string;
}) {
    const fuse = useMemo(() => new Fuse(locations ?? [], FUSE_OPTIONS), [locations]); // only update fuse when the raw data actually changes (we don't care about the extra info status (like time until close) changing)
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
    }, [fuse, searchQuery, locationFilterQuery]);
    return filteredLocations;
}
