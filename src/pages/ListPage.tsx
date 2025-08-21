import { Typography, Alert, styled } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getGreetings, getRandomMikuGreeting } from '../util/greeting';
import { playMikuSound } from '../util/mikuAudio';
import './ListPage.css';
import { IReadOnlyLocation_ExtraData_Map, IReadOnlyLocation_FromAPI_PostProcessed } from '../types/locationTypes';

import SelectLocation from '../components/SelectLocation';
import { useTheme } from '../ThemeProvider';
import IS_MIKU_DAY from '../util/constants';
import mikuKeychainUrl from '../assets/miku/miku-keychain.svg';
import footerMikuUrl from '../assets/miku/miku2.png';
import mikuBgUrl from '../assets/miku/miku.jpg';
import mikuChibiUrl from '../assets/miku/miku-chibi.svg';
import mikuNoteUrl from '../assets/miku/miku-note.svg';
import mikuDancingUrl from '../assets/miku/miku-dancing.svg';
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
    const [emails, setEmails] = useState<{ name: string; email: string }[]>([]);
    const [showOfflineAlert, setShowOfflineAlert] = useState(!navigator.onLine);

    // Miku propaganda state
    const [mikuPropaganda, setMikuPropaganda] = useState('');
    const [showMikuPropaganda, setShowMikuPropaganda] = useState(IS_MIKU_DAY);

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

    // Miku propaganda rotation
    useEffect(() => {
        if (!IS_MIKU_DAY) return;

        const showPropaganda = () => {
            if (Math.random() < 0.3) {
                // 30% chance
                setMikuPropaganda(getRandomMikuGreeting());
                setShowMikuPropaganda(true);
                playMikuSound(); // Play Miku sound when propaganda appears

                // Hide after 5 seconds
                setTimeout(() => {
                    setShowMikuPropaganda(false);
                }, 5000);
            }
        };

        // Show immediately
        showPropaganda();

        // Show every 20-40 seconds randomly
        const interval = setInterval(showPropaganda, 20000 + Math.random() * 20000);

        return () => clearInterval(interval);
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

            {/* Miku Propaganda Alert */}
            {IS_MIKU_DAY && showMikuPropaganda && (
                <div
                    role="button"
                    tabIndex={0}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        background: 'linear-gradient(45deg, #39c5bb, #ff6b9d)',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '10px',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 20px rgba(57, 197, 187, 0.3)',
                        animation: 'mikuFloat 3s ease-in-out infinite',
                        cursor: 'pointer',
                    }}
                    onClick={() => setShowMikuPropaganda(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setShowMikuPropaganda(false);
                        }
                    }}
                >
                    <img src={mikuChibiUrl} alt="Miku!" style={{ width: '30px', height: '30px' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{mikuPropaganda}</span>
                    <button
                        type="button"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMikuPropaganda(false);
                        }}
                    >
                        ×
                    </button>
                </div>
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
                    <div style={{ position: 'relative' }}>
                        <input
                            className="Locations-search"
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={IS_MIKU_DAY ? '🎵 Search with Miku! 🎵' : 'Search'}
                        />
                        {IS_MIKU_DAY && (
                            <img
                                src={mikuNoteUrl}
                                alt="Miku Note"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '16px',
                                    height: '16px',
                                    opacity: 0.7,
                                    pointerEvents: 'none',
                                }}
                                className="miku-pulse"
                            />
                        )}
                    </div>
                    <SelectLocation {...{ setLocationFilterQuery, locations }} />
                    {IS_MIKU_DAY && (
                        <button
                            onClick={() => {
                                updateTheme(theme === 'miku' ? 'none' : 'miku');
                                playMikuSound(); // Play sound when toggling Miku theme
                            }}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                updateTheme(theme === 'miku' ? 'none' : 'miku');
                                playMikuSound(); // Play sound when toggling Miku theme
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
                    {...{
                        locations: filteredLocations,
                        shouldAnimateCards: shouldAnimateCards.current,
                        apiError: locations !== undefined && locations.length === 0,
                        extraLocationData,
                        setSearchQuery,
                        pinnedIds,
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
                            If you encounter any problems, please contact{' '}
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
                            Alternatively, fill out our{' '}
                            <a href="https://forms.gle/7JxgdgDhWMznQJdk9" style={{ color: 'white' }}>
                                feedback form
                            </a>
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
                        {IS_MIKU_DAY && (
                            <FooterText style={{ fontStyle: 'italic', fontSize: '0.9rem', opacity: 0.8 }}>
                                🎤 &quot;Technology and music unite to serve your hunger!&quot; - Hatsune Miku 🎤
                            </FooterText>
                        )}
                    </>
                )}
                <div style={{ position: 'relative' }}>
                    <LogoText variant="h4">
                        cmu
                        <span style={{ color: 'var(--logo-second-half)' }}>:eats</span>
                        {IS_MIKU_DAY && (
                            <span style={{ fontSize: '0.6rem', verticalAlign: 'super', marginLeft: '5px' }}>
                                <img
                                    src={mikuNoteUrl}
                                    alt="Miku Note"
                                    style={{ width: '12px', height: '12px' }}
                                    className="miku-bounce"
                                />
                            </span>
                        )}
                    </LogoText>
                    {/* Additional random floating Miku elements */}
                    {IS_MIKU_DAY && Math.random() < 0.7 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '-30px',
                                opacity: 0.6,
                                animation: 'mikuFloat 4s ease-in-out infinite',
                            }}
                        >
                            <img src={mikuChibiUrl} alt="Miku!" style={{ width: '25px', height: '25px' }} />
                        </div>
                    )}
                </div>
                {theme === 'miku' && <img src={footerMikuUrl} alt="miku!" className="footer__miku" />}
                {/* Extra Miku propaganda when IS_MIKU_DAY but theme isn't miku */}
                {IS_MIKU_DAY && theme !== 'miku' && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            opacity: 0.4,
                            animation: 'mikuFloat 3s ease-in-out infinite',
                        }}
                    >
                        <img
                            src={mikuDancingUrl}
                            alt="Miku is always here!"
                            style={{ width: '80px', height: '80px' }}
                        />
                    </div>
                )}
            </footer>
            <link rel="prefetch" href={mikuBgUrl} />
        </div>
    );
}

export default ListPage;
