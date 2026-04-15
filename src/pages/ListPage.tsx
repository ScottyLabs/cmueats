/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';

import { ILocation_Full } from '../types/locationTypes';
import SelectLocation from '../components/SelectLocation';
import SelectSort from '../components/SelectSort';
import SearchBar from '../components/SearchBar';
import mikuBgUrl from '../assets/miku/miku.jpg';
import EateryCardGrid from '../components/EateryCardGrid';
import Drawer from '../components/Drawer';
import { DrawerAPIContextProvider, useDrawerAPIContext } from '../contexts/DrawerAPIContext';
import { useFilteredLocations, useSortedLocations } from '../util/useFilteredLocations';
import './ListPage.css';
import { CardViewPreference } from '../util/storage';
import Footer from '../components/Footer';
import ListPageHeader from '../components/ListPageHeader';
import { useThemeContext } from '../ThemeProvider';

function ListBox({
    locations,
    error,
    updateCardViewPreference,
}: {
    locations: ILocation_Full[] | undefined;
    error: boolean;
    updateCardViewPreference: (id: string, newStatus: CardViewPreference) => void;
}) {
    const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);
    const shouldAnimateCards = useRef(true);
    const { closeDrawer } = useDrawerAPIContext();
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
    const [sortBy, setSortBy] = useReducer<'' | 'distance', ['' | 'distance']>((_, newState) => {
        shouldAnimateCards.current = false;
        return newState;
    }, '');

    const filteredLocations = useFilteredLocations({
        locations,
        searchQuery,
        locationFilterQuery,
    });
    const sortedLocations = useSortedLocations({ locations: filteredLocations, sortBy, userCoordinates });

    const requestUserCoordinates = () => {
        if (!navigator.geolocation || isFetchingCoordinates || userCoordinates !== null) return;
        setIsFetchingCoordinates(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setUserCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
                setIsFetchingCoordinates(false);
            },
            () => {
                setIsFetchingCoordinates(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            },
        );
    };
    // Load query from URL
    useLayoutEffect(() => {
        const urlQuery = new URLSearchParams(window.location.search).get('search');
        if (urlQuery) {
            setSearchQuery(urlQuery);
        }
    }, []);
    return (
        <div
            className="list-box"
            onClick={(ev) => {
                if (!ev.defaultPrevented) closeDrawer();
            }}
        >
            <ListPageHeader />
            <div className="list-controls-container" onClick={(ev) => ev.preventDefault()}>
                <div className="list-controls-layout">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <SelectLocation {...{ setLocationFilterQuery, locations }} />
                    <SelectSort
                        sortBy={sortBy}
                        setSortBy={(newSortBy) => {
                            setSortBy(newSortBy);
                            if (newSortBy === 'distance') requestUserCoordinates();
                        }}
                    />
                </div>
            </div>
            <EateryCardGrid
                locations={sortedLocations}
                shouldAnimateCards={shouldAnimateCards.current}
                apiError={error}
                setSearchQuery={setSearchQuery}
                updateCardViewPreference={(id, preference) => {
                    shouldAnimateCards.current = false;
                    updateCardViewPreference(id, preference);
                }}
            />
            <Footer />
        </div>
    );
}
function ListPage({
    locations,
    updateCardViewPreference,
    error,
}: {
    locations: ILocation_Full[] | undefined;
    error: boolean;
    updateCardViewPreference: (id: string, newStatus: CardViewPreference) => void;
}) {
    const mainContainerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        mainContainerRef.current?.focus();
    }, []);

    const { theme } = useThemeContext();

    return (
        <DrawerAPIContextProvider>
            <div className="list-page-container" ref={mainContainerRef}>
                <ListBox error={error} locations={locations} updateCardViewPreference={updateCardViewPreference} />
                <Drawer locations={locations} />
                <link rel="prefetch" href={mikuBgUrl} />
                {theme === 'collegecart'}
            </div>
        </DrawerAPIContextProvider>
    );
}

export default ListPage;
