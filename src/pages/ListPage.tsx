import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';

import { ILocation_Full } from '../types/locationTypes';
import SelectLocation from '../components/SelectLocation';
import SearchBar from '../components/SearchBar';
import mikuBgUrl from '../assets/miku/miku.jpg';
import EateryCardGrid from '../components/EateryCardGrid';
import Drawer from '../components/Drawer';
import { DrawerAPIContextProvider } from '../contexts/DrawerAPIContext';
import useFilteredLocations from './useFilteredLocations';
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
    const mainContainerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        mainContainerRef.current?.focus();
    }, []);

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
        <DrawerAPIContextProvider>
            <div className="list-page-container" ref={mainContainerRef}>
                <div className="list-box">
                    <ListPageHeader />
                    <div className="list-controls-container">
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

                <Drawer locations={locations} />
                <link rel="prefetch" href={mikuBgUrl} />
            </div>
        </DrawerAPIContextProvider>
    );
}

export default ListPage;
