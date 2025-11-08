import { Typography, Alert, styled } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getGreetings } from '../util/greeting';
import './ListPage.css';
import { IReadOnlyLocation_ExtraData_Map, IReadOnlyLocation_FromAPI_PostProcessed } from '../types/locationTypes';

import SelectLocation from '../components/SelectLocation';
import SearchBar from '../components/SearchBar';
import SortBy from '../components/SortBy';
import { useTheme } from '../ThemeProvider';
import IS_MIKU_DAY from '../util/constants';
import mikuKeychainUrl from '../assets/miku/miku-keychain.svg';
import footerMikuUrl from '../assets/miku/miku2.png';
import mikuBgUrl from '../assets/miku/miku.jpg';
import EateryCardGrid from './EateryCardGrid';
import useFilteredLocations from './useFilteredLocations';
import env from '../env';

const LogoText = styled(Typography)({
    color: 'var(--logo-first-half)',
    padding: 0,
    fontFamily: 'var(--text-primary-font)',
    fontWeight: 800,
});

const FooterText = styled(Typography)({
    color: 'var(--text-primary)',
    marginBottom: 20,
    fontSize: 16,
});

const StyledAlert = styled(Alert)({
    backgroundColor: 'var(--main-bg-accent)',
    color: 'var(--text-primary)',
});

function getPittsburghTime() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
    };
    return now.toLocaleString('en-US', options);
}

function ListPage({
    extraLocationData,
    locations,
    pinnedIds,
    updatePinnedIds,
}: {
    extraLocationData: IReadOnlyLocation_ExtraData_Map | undefined;
    locations: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
    pinnedIds: Record<string, true>;
    updatePinnedIds: (newPinnedIds: Record<string, true>) => void;
}) {
    const { theme, updateTheme } = useTheme();
    const shouldAnimateCards = useRef(true);

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

    const [sortBy, setSortBy] = useReducer<(_: string, x: string) => string>((_, newState) => {
        shouldAnimateCards.current = false;
        return newState;
    }, 'closing-time');
    const [locationDistances, setLocationDistances] = useState<Map<number, number>>(new Map());
    const [emails, setEmails] = useState<{ name: string; email: string }[]>([]);
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

    // Fetch emails on mount
    useEffect(() => {
        async function fetchEmails() {
            try {
                const res = await fetch(`${env.VITE_API_URL}/api/emails`);
                const json = await res.json();
                setEmails(json);
            } catch (err) {
                console.error('Failed to fetch emails:', err);
            }
        }
        fetchEmails();
    }, []);

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
                    <div className="Locations-header__filters">
                        <SelectLocation {...{ setLocationFilterQuery, locations }} />
                        <SortBy
                            {...{
                                setSortBy,
                                sortBy,
                                locations,
                                onLocationDistancesCalculated: setLocationDistances,
                            }}
                        />
                    </div>
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
                    key={`${searchQuery}-${locationFilterQuery}-${sortBy}`}
                    {...{
                        locations: filteredLocations,
                        shouldAnimateCards: shouldAnimateCards.current,
                        apiError: locations !== undefined && locations.length === 0,
                        extraLocationData,
                        setSearchQuery,
                        pinnedIds,
                        sortBy,
                        locationDistances,
                        updatePinnedIds: (newPinnedIds: Record<string, true>) => {
                            shouldAnimateCards.current = false;
                            updatePinnedIds(newPinnedIds);
                        },
                    }}
                />
            </div>

            <footer className="footer">
                {theme === 'miku' ? (
                    <FooterText>
                        Blue hair, blue tie, hiding in your wifi
                        <br />
                        All times are displayed in Pittsburgh local time ({getPittsburghTime()}).
                    </FooterText>
                ) : (
                    <>
                        <FooterText>
                            All times are displayed in Pittsburgh local time ({getPittsburghTime()}).
                        </FooterText>
                        <FooterText>
                            If you encounter any problems, please fill out our{' '}
                            <a href="https://forms.gle/7JxgdgDhWMznQJdk9" style={{ color: 'white' }}>
                                feedback form
                            </a>{' '}
                            (the fastest way to reach us!).
                        </FooterText>
                        <FooterText>
                            Otherwise, reach out to{' '}
                            {emails.length > 0 ? (
                                emails.map((person, idx) => (
                                    <span key={person.email}>
                                        <a href={`mailto:${person.email}`} style={{ color: 'white' }}>
                                            {person.name}
                                        </a>
                                        {idx < emails.length - 2 ? ', ' : ''}
                                        {/* eslint-disable-next-line no-nested-ternary */}
                                        {idx === emails.length - 2 ? (emails.length > 2 ? ', or ' : ' or ') : ''}
                                    </span>
                                ))
                            ) : (
                                <span>
                                    <a href="mailto:hello@scottylabs.org" style={{ color: 'white' }}>
                                        ScottyLabs
                                    </a>
                                </span>
                            )}
                            .
                        </FooterText>
                        <FooterText>
                            To provide feedback on your dining experience, please contact{' '}
                            <a href="mailto:dining@andrew.cmu.edu" style={{ color: 'white' }}>
                                Dining Services
                            </a>{' '}
                            or take the{' '}
                            <a href="https://forms.gle/fTnWrS7jkTFRB14DA" style={{ color: 'white' }}>
                                dining survey
                            </a>
                            .
                        </FooterText>
                        <FooterText>
                            Made with ❤️ by the{' '}
                            <a href="https://scottylabs.org" style={{ color: 'white' }}>
                                ScottyLabs
                            </a>{' '}
                            Tech Committee (not the official{' '}
                            <a
                                href="https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Schedule"
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: 'white' }}
                            >
                                dining website
                            </a>
                            ).
                        </FooterText>
                    </>
                )}
                <LogoText variant="h4">
                    cmu
                    <span style={{ color: 'var(--logo-second-half)' }}>:eats</span>
                </LogoText>
                {theme === 'miku' && <img src={footerMikuUrl} alt="miku!" className="footer__miku" />}
            </footer>
            <link rel="prefetch" href={mikuBgUrl} />
        </div>
    );
}

export default ListPage;
