import { describe, test, expect } from 'vitest';
import { useFilteredLocations, useSortedLocations, SortOption } from '../../src/util/useLocationList';
import { ILocation_Full, LocationState } from '../../src/types/locationTypes';
import { renderHook } from '@testing-library/react';

function makeLocation(overrides: Partial<ILocation_Full> & { name: string }): ILocation_Full {
    return {
        id: overrides.name,
        ratingsAvg: null,
        ratingsCount: 0,
        shortDescription: null,
        description: '',
        url: '',
        menu: null,
        location: '',
        coordinateLat: null,
        coordinateLng: null,
        acceptsOnlineOrders: false,
        times: [],
        todaysSpecials: [],
        todaysSoups: [],
        conceptId: null,
        closedLongTerm: false,
        isOpen: true,
        minutesUntil: 0,
        changesSoon: false,
        statusMsg: { shortStatus: ['', ''], longStatus: '' },
        locationState: LocationState.OPEN,
        cardViewPreference: 'normal' as never,
        distanceFromUserMeters: null,
        ...overrides,
    } as ILocation_Full;
}

function sort(locations: ILocation_Full[], sortBy: SortOption) {
    const { result } = renderHook(() => useSortedLocations({ locations, sortBy }));
    return result.current!;
}

function filter(locations: ILocation_Full[], searchQuery: string, locationFilterQuery: string) {
    const { result } = renderHook(() => useFilteredLocations({ locations, searchQuery, locationFilterQuery }));
    return result.current!;
}

const CAFE = makeLocation({ name: 'Cafe', location: 'Cohon Center', ratingsAvg: 4.5, locationState: LocationState.OPEN, minutesUntil: 60 });
const LIBRARY = makeLocation({ name: 'Library', location: 'Hunt Library', ratingsAvg: 3.0, locationState: LocationState.OPEN, minutesUntil: 30 });
const DINER = makeLocation({ name: 'Diner', location: 'Cohon Center', ratingsAvg: null, locationState: LocationState.OPEN, minutesUntil: 90 });
const CLOSED = makeLocation({ name: 'Closed', location: 'Wean Hall', ratingsAvg: 4.0, locationState: LocationState.CLOSED, minutesUntil: 120, isOpen: false });
const CLOSES_SOON = makeLocation({ name: 'ClosesSoon', location: 'Hunt Library', ratingsAvg: 2.0, locationState: LocationState.CLOSES_SOON, minutesUntil: 5, isOpen: true });
const LONG_TERM = makeLocation({ name: 'LongTerm', location: 'Gates Center', ratingsAvg: 5.0, closedLongTerm: true, locationState: LocationState.CLOSED_LONG_TERM } as any);

describe('useFilteredLocations', () => {
    const locations = [CAFE, LIBRARY, DINER, CLOSED, CLOSES_SOON, LONG_TERM];

    test('returns all locations when both queries are empty', () => {
        const result = filter(locations, '', '');
        expect(result).toHaveLength(6);
    });

    test('filters by search query matching name', () => {
        const result = filter(locations, 'Cafe', '');
        expect(result).toHaveLength(1);
        expect(result![0].name).toBe('Cafe');
    });

    test('filters by search query matching location', () => {
        const result = filter(locations, 'Cohon', '');
        expect(result).toHaveLength(2);
        expect(result!.map((l) => l.name).sort()).toEqual(['Cafe', 'Diner']);
    });

    test('filters by search query matching description', () => {
        const withDesc = makeLocation({ name: 'TestPlace', description: 'serves coffee and pastries', locationState: LocationState.OPEN, minutesUntil: 60 });
        const result = filter([withDesc], 'coffee', '');
        expect(result).toHaveLength(1);
        expect(result![0].name).toBe('TestPlace');
    });

    test('search is case insensitive', () => {
        const result = filter(locations, 'cafe', '');
        expect(result).toHaveLength(1);
        expect(result![0].name).toBe('Cafe');
    });

    test('search is fuzzy', () => {
        const result = filter(locations, 'lib', '');
        expect(result!.map((l) => l.name).sort()).toEqual(['ClosesSoon', 'Library']);
    });

    test('returns empty for no matches', () => {
        const result = filter(locations, 'nonexistent', '');
        expect(result).toHaveLength(0);
    });

    test('returns undefined when locations is undefined', () => {
        const { result } = renderHook(() =>
            useFilteredLocations({ locations: undefined, searchQuery: 'test', locationFilterQuery: '' }),
        );
        expect(result.current).toBeUndefined();
    });
});

describe('useSortedLocations', () => {
    describe('sortBy: open (default status sort)', () => {
        test('sorts by locationState priority, then by minutesUntil', () => {
            const locations = [CLOSED, CAFE, CLOSES_SOON, LIBRARY];
            const sorted = sort(locations, 'open');
            expect(sorted.map((l) => l.name)).toEqual(['Cafe', 'Library', 'ClosesSoon', 'Closed']);
        });

        test('puts closed long term last, sorted alphabetically', () => {
            const locations = [LONG_TERM, CAFE, CLOSED];
            const sorted = sort(locations, 'open');
            expect(sorted.map((l) => l.name)).toEqual(['Cafe', 'Closed', 'LongTerm']);
        });

        test('returns undefined for undefined locations', () => {
            const { result } = renderHook(() => useSortedLocations({ locations: undefined, sortBy: 'open' }));
            expect(result.current).toBeUndefined();
        });
    });

    describe('sortBy: distance', () => {
        test('sorts by distanceFromUserMeters within same state', () => {
            const near = makeLocation({ name: 'Near', locationState: LocationState.OPEN, distanceFromUserMeters: 100, minutesUntil: 60 });
            const far = makeLocation({ name: 'Far', locationState: LocationState.OPEN, distanceFromUserMeters: 500, minutesUntil: 60 });
            const sorted = sort([far, near], 'distance');
            expect(sorted.map((l) => l.name)).toEqual(['Near', 'Far']);
        });

        test('sorts by state first, then by distance', () => {
            const openFar = makeLocation({ name: 'OpenFar', locationState: LocationState.OPEN, distanceFromUserMeters: 500, minutesUntil: 60 });
            const closedNear = makeLocation({ name: 'ClosedNear', locationState: LocationState.CLOSED, distanceFromUserMeters: 100, isOpen: false, minutesUntil: 120 });
            const sorted = sort([closedNear, openFar], 'distance');
            expect(sorted.map((l) => l.name)).toEqual(['OpenFar', 'ClosedNear']);
        });

        test('null distances sort after non-null', () => {
            const withDist = makeLocation({ name: 'WithDist', locationState: LocationState.OPEN, distanceFromUserMeters: 100, minutesUntil: 60 });
            const noDist = makeLocation({ name: 'NoDist', locationState: LocationState.OPEN, distanceFromUserMeters: null, minutesUntil: 60 });
            const sorted = sort([withDist, noDist], 'distance');
            expect(sorted.map((l) => l.name)).toEqual(['WithDist', 'NoDist']);
        });

        test('falls back to status sort when both distances are null', () => {
            const a = makeLocation({ name: 'A', locationState: LocationState.CLOSED, distanceFromUserMeters: null, isOpen: false, minutesUntil: 120 });
            const b = makeLocation({ name: 'B', locationState: LocationState.OPEN, distanceFromUserMeters: null, minutesUntil: 60 });
            const sorted = sort([a, b], 'distance');
            expect(sorted.map((l) => l.name)).toEqual(['B', 'A']);
        });
    });

    describe('sortBy: rating-highest', () => {
        test('sorts by ratingsAvg descending', () => {
            const sorted = sort([DINER, CAFE, LIBRARY], 'rating-highest');
            expect(sorted.map((l) => l.name)).toEqual(['Cafe', 'Library', 'Diner']);
        });

        test('null ratings sort to the end', () => {
            const sorted = sort([CAFE, DINER, LIBRARY], 'rating-highest');
            expect(sorted.map((l) => l.name)).toEqual(['Cafe', 'Library', 'Diner']);
        });

        test('equal ratings fall back to status sort', () => {
            const a = makeLocation({ name: 'A', ratingsAvg: 4.0, locationState: LocationState.OPEN, minutesUntil: 60 });
            const b = makeLocation({ name: 'B', ratingsAvg: 4.0, locationState: LocationState.CLOSES_SOON, minutesUntil: 5 });
            const sorted = sort([b, a], 'rating-highest');
            expect(sorted.map((l) => l.name)).toEqual(['A', 'B']);
        });
    });

    describe('sortBy: rating-highest-open', () => {
        test('open locations come before closed, sorted by rating desc within each group', () => {
            const sorted = sort([CLOSED, CAFE, CLOSES_SOON, LIBRARY], 'rating-highest-open');
            expect(sorted.map((l) => l.name)).toEqual(['Cafe', 'Library', 'ClosesSoon', 'Closed']);
        });

        test('among open locations, sorts by rating descending', () => {
            const sorted = sort([LIBRARY, CAFE, CLOSES_SOON], 'rating-highest-open');
            expect(sorted.map((l) => l.name)).toEqual(['Cafe', 'Library', 'ClosesSoon']);
        });
    });

    describe('sortBy: rating-lowest', () => {
        test('sorts by ratingsAvg ascending, null ratings last', () => {
            const sorted = sort([CAFE, LIBRARY, DINER], 'rating-lowest');
            expect(sorted.map((l) => l.name)).toEqual(['Library', 'Cafe', 'Diner']);
        });
    });
});
