import { Alert, styled } from '@mui/material';
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

const StyledAlert = styled(Alert)({
    backgroundColor: 'var(--main-bg-accent)',
    color: 'var(--text-primary)',
});

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

    const isMobile = window.innerWidth <= 600;

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
    const [showOfflineAlert, setShowOfflineAlert] = useState(!navigator.onLine);

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

    // Monitor for the user being online
    useEffect(() => {
        const handleOnlineStatus = () => {
            setShowOfflineAlert(!navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    return (
        <DrawerAPIContextProvider>
            <div className="list-page-container" ref={mainContainerRef}>
                {/*  showAlert &&
      <StyledAlert severity="info" className="announcement" onClose={() => setShowAlert(false)}>
        🚧 [Issue Description]
        Please remain patient while we work on a fix. Thank you. 🚧
      </StyledAlert>  */}
                {showOfflineAlert && (
                    <StyledAlert severity="info" className="announcement" onClose={() => setShowOfflineAlert(false)}>
                        🚫🌐 We are temporarily unable to provide the latest available dining information or the map
                        while you are offline. We apologize for any inconvenience. 🌐🚫
                    </StyledAlert>
                )}

                <div className="list-box">
                    <ListPageHeader />
                    <div className="list-controls-container">
                        <div className="list-controls-layout">
                            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                            {!isMobile && <SelectLocation {...{ setLocationFilterQuery, locations }} />}
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
