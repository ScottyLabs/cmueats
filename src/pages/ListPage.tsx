import { Alert, styled } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { DateTime } from 'luxon';

import { getGreetings } from '../util/greeting';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import SelectLocation from '../components/SelectLocation';
import SearchBar from '../components/SearchBar';
import { useThemeContext } from '../ThemeProvider';
import IS_MIKU_DAY from '../util/constants';
import mikuBgUrl from '../assets/miku/miku.jpg';
import EateryCardGrid from './EateryCardGrid';
import Drawer from '../components/Drawer';
import { DrawerContext, TabType } from '../contexts/DrawerContext';
import useFilteredLocations from './useFilteredLocations';
import './ListPage.css';
import env from '../env';
import { CardViewPreference } from '../util/storage';
import Footer from '../components/Footer';

const StyledAlert = styled(Alert)({
    backgroundColor: 'var(--main-bg-accent)',
    color: 'var(--text-primary)',
});

function ListPage({
    locations,
    updateCardViewPreference,
    now,
}: {
    locations: IReadOnlyLocation_Combined[] | undefined;
    now: DateTime;
    updateCardViewPreference: (id: string, newStatus: CardViewPreference) => void;
}) {
    const shouldAnimateCards = useRef(true);
    const { theme, updateTheme } = useThemeContext();

    // permanently cut out animation when user filters cards,
    // so we don't end up with some cards (but not others)
    // re-animating in when filter gets cleared
    const [searchQuery, setSearchQuery] = useReducer<(_: string, updated: string) => string>((_, newState) => {
        shouldAnimateCards.current = false;
        return newState;
    }, '');

    const [locationFilterQuery, setLocationFilterQuery] = useReducer<(_: string, x: string) => string>(
        (_, newState) => {
            shouldAnimateCards.current = false;
            return newState;
        },
        '',
    );
    const mainContainerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        mainContainerRef.current?.focus();
    }, []);
    const [showOfflineAlert, setShowOfflineAlert] = useState(!navigator.onLine);

    const { mobileGreeting, desktopGreeting } = useMemo(
        () => getGreetings(new Date().getHours(), { isMikuDay: IS_MIKU_DAY }),
        [],
    );

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

    const [isDrawerActive, setIsDrawerActive] = useState(false);
    const [drawerLocation, setDrawerLocation] = useState<IReadOnlyLocation_Combined | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const isDrawerActiveRef = useRef(isDrawerActive);
    useEffect(() => {
        isDrawerActiveRef.current = isDrawerActive;
    }, [isDrawerActive]);
    // if drawer if open, update the drawer's content whenever extraLocationData gets updated
    // TODO: might buggy
    useEffect(() => {
        if (!isDrawerActiveRef.current || !drawerLocation || !locations) return;
        const baseLocation = locations.find((loc) => loc.conceptId === drawerLocation.conceptId);
        if (!baseLocation) return;
        setDrawerLocation(baseLocation);
    }, [drawerLocation?.conceptId, locations]);
    const drawerContextValue = useMemo(
        () => ({
            isDrawerActive,
            setIsDrawerActive: (active: boolean) => {
                setIsDrawerActive(active);
                // ensure drawer content don't change before fully exited
                setTimeout(() => {
                    // ensure drawerLocation is null if it is inactive
                    if (!isDrawerActiveRef.current) setDrawerLocation(null);
                }, 500);
            },
            drawerLocation,
            setDrawerLocation,
            activeTab,
            setActiveTab,
        }),
        [isDrawerActive, drawerLocation, activeTab],
    );

    return (
        <DrawerContext.Provider value={drawerContextValue}>
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
                    <header className="list-header">
                        <h3 className="list-header__greeting list-header__greeting--desktop">{desktopGreeting}</h3>
                        <h3 className="list-header__greeting list-header__greeting--mobile">{mobileGreeting}</h3>
                    </header>
                    <div className="list-controls-container">
                        <div className="list-controls-layout">
                            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                            <SelectLocation {...{ setLocationFilterQuery, locations }} />
                        </div>
                    </div>
                    <EateryCardGrid
                        key={`${searchQuery}-${locationFilterQuery}`}
                        locations={filteredLocations}
                        shouldAnimateCards={shouldAnimateCards.current}
                        apiError={locations !== undefined && locations.length === 0}
                        setSearchQuery={setSearchQuery}
                        updateCardViewPreference={(id, preference) => {
                            shouldAnimateCards.current = false;
                            updateCardViewPreference(id, preference);
                        }}
                    />
                    <Footer now={now} />
                </div>
                <Drawer />
                <link rel="prefetch" href={mikuBgUrl} />
            </div>
        </DrawerContext.Provider>
    );
}

export default ListPage;
