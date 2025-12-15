import { Alert, styled } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { DateTime } from 'luxon';

import { getGreetings } from '../util/greeting';
import './ListPage.css';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import SelectLocation from '../components/SelectLocation';
import SearchBar from '../components/SearchBar';
import { useThemeContext } from '../ThemeProvider';
import IS_MIKU_DAY from '../util/constants';
import mikuKeychainUrl from '../assets/miku/miku-keychain.svg';
import mikuBgUrl from '../assets/miku/miku.jpg';
import EateryCardGrid from './EateryCardGrid';
import useFilteredLocations from './useFilteredLocations';
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

    return (
        <div className="ListPage">
            {/*  showAlert &&
      <StyledAlert severity="info" className="announcement" onClose={() => setShowAlert(false)}>
        🚧 [Issue Description]
        Please remain patient while we work on a fix. Thank you. 🚧
      </StyledAlert>  */}
            {showOfflineAlert && (
                <StyledAlert severity="info" className="announcement" onClose={() => setShowOfflineAlert(false)}>
                    🚫🌐 We are temporarily unable to provide the latest available dining information or the map while
                    you are offline. We apologize for any inconvenience. 🌐🚫
                </StyledAlert>
            )}

            <div className="ListPage__container">
                <header className="Locations-header">
                    <div className="Locations-header__greeting-container">
                        <h3 className="Locations-header__greeting Locations-header__greeting--desktop">
                            {desktopGreeting}
                        </h3>
                        <h3 className="Locations-header__greeting Locations-header__greeting--mobile">
                            {mobileGreeting}
                        </h3>
                    </div>
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <SelectLocation {...{ setLocationFilterQuery, locations }} />
                    {IS_MIKU_DAY && (
                        <button
                            onClick={() => updateTheme(theme === 'miku' ? 'none' : 'miku')}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                updateTheme(theme === 'miku' ? 'none' : 'miku');
                            }}
                            type="button"
                            className="Locations-header__miku-toggle"
                        >
                            <img src={mikuKeychainUrl} alt="click me!" />
                        </button>
                    )}
                </header>

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
            </div>
            <Footer now={now} />
            <link rel="prefetch" href={mikuBgUrl} />
        </div>
    );
}

export default ListPage;
