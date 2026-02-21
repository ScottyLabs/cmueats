import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';

import { ILocation_Full, LocationState } from '../types/locationTypes';
import SelectLocation from '../components/SelectLocation';
import SortByDropdown from '../components/SortByDropdown';
import SearchBar from '../components/SearchBar';
import mikuBgUrl from '../assets/miku/miku.jpg';
import EateryCardGrid from '../components/EateryCardGrid';
import Drawer from '../components/Drawer';
import { DrawerAPIContextProvider } from '../contexts/DrawerAPIContext';
import useFilteredLocations from './useFilteredLocations';
import { getDistanceMeters } from '../util/distances';
import './ListPage.css';
import { CardViewPreference } from '../util/storage';
import Footer from '../components/Footer';
import ListPageHeader from '../components/ListPageHeader';

function ListPage({
    locations,
    updateCardViewPreference,
    error,
}: {
    locations: ILocation_Full[] | undefined;
    error: boolean;
    updateCardViewPreference: (id: string, newStatus: CardViewPreference) => void;
}) {
    const shouldAnimateCards = useRef(true);

    // permanently cut out animation when user filters cards,
    // so we don't end up with some cards (but not others)
    // re-animating in when filter gets cleared
    const [searchQuery, setSearchQuery] = useReducer<string, [string]>((_, newState) => {
        shouldAnimateCards.current = false;
        return newState;
    }, '');

    const [locationFilterQuery, setLocationFilterQuery] = useReducer<string, [string]>((_, newState) => {
        shouldAnimateCards.current = false;
        return newState;
    }, '');
    const [sortBy, setSortBy] = useState<'' | 'default' | 'distance'>('');
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
    const mainContainerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        mainContainerRef.current?.focus();
    }, []);

    const filteredLocations = useFilteredLocations({
        locations,
        searchQuery,
        locationFilterQuery,
    });

    const handleSortByChange = useCallback((option: '' | 'default' | 'distance') => {
        setSortBy(option);
        if (option === 'distance' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => {}
            );
        } else {
            setUserCoords(null);
        }
    }, []);

    const sortedLocations = useMemo(() => {
        if (filteredLocations === undefined || userCoords === null) return filteredLocations;
        return [...filteredLocations].sort((a, b) => {
            if (a.locationState !== b.locationState) return a.locationState - b.locationState;
            const aLat = a.coordinateLat;
            const aLng = a.coordinateLng;
            const bLat = b.coordinateLat;
            const bLng = b.coordinateLng;
            const aDist =
                aLat != null && aLng != null
                    ? getDistanceMeters(userCoords.lat, userCoords.lng, aLat, aLng)
                    : Infinity;
            const bDist =
                bLat != null && bLng != null
                    ? getDistanceMeters(userCoords.lat, userCoords.lng, bLat, bLng)
                    : Infinity;
            return aDist - bDist;
        });
    }, [filteredLocations, userCoords]);

    // Load query from URL
    useLayoutEffect(() => {
        const urlQuery = new URLSearchParams(window.location.search).get('search');
        if (urlQuery) {
            setSearchQuery(urlQuery);
        }
    }, []);

    return (
        <DrawerAPIContextProvider>
            <div className="list-page-container" ref={mainContainerRef}>
                <div className="list-box">
                    <ListPageHeader />
                    <div className="list-controls-container">
                        <div className="list-controls-layout">
                            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                            <SelectLocation {...{ setLocationFilterQuery, locations }} />
                            <SortByDropdown value={sortBy} onChange={handleSortByChange} />
                        </div>
                    </div>
                    <EateryCardGrid
                        locations={
                            sortBy === 'distance' && userCoords !== null ? sortedLocations : filteredLocations
                        }
                        shouldAnimateCards={shouldAnimateCards.current}
                        apiError={error}
                        setSearchQuery={setSearchQuery}
                        preserveOrder={sortBy === 'distance' && userCoords !== null}
                        updateCardViewPreference={(id, preference) => {
                            shouldAnimateCards.current = false;
                            updateCardViewPreference(id, preference);
                        }}
                    />
                    <Footer />
                </div>

                <Drawer locations={locations} />
                <link rel="prefetch" href={mikuBgUrl} />
            </div>
        </DrawerAPIContextProvider>
    );
}

export default ListPage;
