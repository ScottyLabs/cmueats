/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useLayoutEffect, useReducer, useRef } from 'react';

import { ILocation_Full } from '../types/locationTypes';
import SelectLocation from '../components/SelectLocation';
import SearchBar from '../components/SearchBar';
import mikuBgUrl from '../assets/miku/miku.jpg';
import EateryCardGrid from '../components/EateryCardGrid';
import Drawer from '../components/Drawer';
import { DrawerAPIContextProvider, useDrawerAPIContext } from '../contexts/DrawerAPIContext';
import useFilteredLocations from './useFilteredLocations';
import './ListPage.css';
import { CardViewPreference } from '../util/storage';
import Footer from '../components/Footer';
import ListPageHeader from '../components/ListPageHeader';

function ListBox({
    locations,
    error,
    updateCardViewPreference,
}: {
    locations: ILocation_Full[] | undefined;
    error: boolean;
    updateCardViewPreference: (id: string, newStatus: CardViewPreference) => void;
}) {
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

    const filteredLocations = useFilteredLocations({
        locations,
        searchQuery,
        locationFilterQuery,
    });

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
                </div>
            </div>
            <EateryCardGrid
                locations={filteredLocations}
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

    return (
        <DrawerAPIContextProvider>
            <div className="list-page-container" ref={mainContainerRef}>
                <ListBox error={error} locations={locations} updateCardViewPreference={updateCardViewPreference} />
                <Drawer locations={locations} />
                <link rel="prefetch" href={mikuBgUrl} />
            </div>
        </DrawerAPIContextProvider>
    );
}

export default ListPage;
