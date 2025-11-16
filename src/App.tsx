import React, { useEffect, useRef, useState, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DateTime } from 'luxon';
import { motion } from 'motion/react';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from './components/Navbar';
import ListPage from './pages/ListPage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';
import { queryLocations, getLocationStatus } from './util/queryLocations';
import './App.css';
import { IReadOnlyLocation_FromAPI_PostProcessed, IReadOnlyLocation_Combined } from './types/locationTypes';
import { useUserCardViewPreferences } from './util/storage';
import env from './env';
import scottyDog from './assets/banner/scotty-dog.svg';
import closeButton from './assets/banner/close-button.svg';
import useLocalStorage from './util/localStorage';
import bocchiError from './assets/bocchi-error.webp';
import useRefreshWhenBackOnline from './util/network';

const BACKEND_LOCATIONS_URL =
    env.VITE_API_URL === 'locations.json' ? '/locations.json' : `${env.VITE_API_URL}/locations`;
const BANNER_VERSION = '11/14';
function App() {
    const mainContainerRef = useRef<HTMLDivElement | null>(null);
    // Load locations
    const [locations, setLocations] = useState<IReadOnlyLocation_FromAPI_PostProcessed[]>();
    const [now, setNow] = useState(DateTime.now().setZone('America/New_York'));
    const [cardViewPreferences, setCardViewPreferences] = useUserCardViewPreferences();

    useRefreshWhenBackOnline();

    useEffect(() => {
        queryLocations(BACKEND_LOCATIONS_URL).then(setLocations);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => setNow(DateTime.now().setZone('America/New_York')), 1000);
        return () => clearInterval(intervalId);
    }, []);
    useEffect(() => {
        mainContainerRef.current?.focus();
    }, []);

    const fullLocationData: IReadOnlyLocation_Combined[] | undefined = locations?.map((location) => ({
        ...location,
        ...getLocationStatus(location.times, now),
        cardViewPreference: cardViewPreferences[location.conceptId] ?? 'normal',
    }));

    return (
        <React.StrictMode>
            <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                <BrowserRouter>
                    <div className="App">
                        <Banner />
                        {/* <div className="AdBanner">
                            CMUEats is now up to date with the official dining website! Sorry for the inconvenience.
                            &gt;_&lt;
                        </div> */}
                        <div className="MainContent" ref={mainContainerRef}>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <ListPage
                                            locations={fullLocationData}
                                            updateCardViewPreference={(id, preference) => {
                                                const newPreferences = { ...cardViewPreferences, [id]: preference };
                                                setCardViewPreferences(newPreferences);
                                            }}
                                        />
                                    }
                                />
                                <Route path="/map" element={<MapPage locations={fullLocationData} />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </div>
                        <Navbar />
                    </div>
                </BrowserRouter>
            </ErrorBoundary>
        </React.StrictMode>
    );
}

function ErrorBoundaryFallback() {
    return (
        <div className="outer-error-container">
            oh... uhhh... well this is awkward. we have encountered an issue while rendering this page{' '}
            <img src={bocchiError} alt="" />
            the error has been automatically reported to the cmueats team
            <div className="outer-error-container__small-text">
                Please <a href=".">refresh the page</a> or check dining hours on GrubHub or{' '}
                <a href="https://apps.studentaffairs.cmu.edu/dining/conceptinfo/" target="_blank" rel="noreferrer">
                    https://apps.studentaffairs.cmu.edu/dining/conceptinfo/
                </a>{' '}
                for now
            </div>
        </div>
    );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
console.log(localStorage)
function Banner() {
    // store banner's current state in browser local storage
    const [bannerStateOutput, setBannerStateOutput] = useLocalStorage('banner-state');
    
    // Parse banner state from localStorage, with default values (reactive to bannerStateOutput changes)
    const bannerState = useMemo(() => {
        if (bannerStateOutput) {
            try {
                return JSON.parse(bannerStateOutput);
            } catch (e) {
                // If parsing fails, return default
                return { version: BANNER_VERSION, closed: false };
            }
        }
        return { version: BANNER_VERSION, closed: false };
    }, [bannerStateOutput]);
    
    // when app loads, checks if stored banner version matches local 'BANNER_VERSION'
    // if version is different, reset the closed state to show the banner again
    useEffect(() => {
        const currentState = localStorage.getItem('banner-state');
        if (currentState) {
            try {
                const parsed = JSON.parse(currentState);
                if (parsed.version !== BANNER_VERSION) {
                    setBannerStateOutput(JSON.stringify({ version: BANNER_VERSION, closed: false }));
                }
            } catch (e) {
                // If parsing fails, initialize with current version
                setBannerStateOutput(JSON.stringify({ version: BANNER_VERSION, closed: false }));
            }
        } else {
            // No existing state, initialize
            setBannerStateOutput(JSON.stringify({ version: BANNER_VERSION, closed: false }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount
    
    // Listen for localStorage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'banner-state' && e.newValue) {
                // Force re-read from localStorage when another tab updates it
                setBannerStateOutput(e.newValue);
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [setBannerStateOutput]);
    
    // Ensure we're using the current version when closing
    const closeBanner = () => {
        setBannerStateOutput(JSON.stringify({ version: BANNER_VERSION, closed: true }));
    };

    // Show banner if not closed and version matches
    const shouldShow = !bannerState.closed && bannerState.version === BANNER_VERSION;
    return (
        <motion.div
            className="welcome-banner-container"
            animate={{ height: shouldShow ? 'auto' : 0 }}
            initial={{ height: shouldShow ? 'auto' : 0 }}
        >
            <div className="welcome-banner">
                <div className="welcome-banner__spacer" />
                <div className="welcome-banner__text welcome-banner-padding">
                    <span className="welcome-banner__text--long">
                        <img src={scottyDog} alt="" />
                        <span>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSd6mXSOzxxUctc0EeQBTanqebc31xmBnKb_cFRosqHjtmuemg/viewform"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Register
                            </a>{' '}
                            for Nova, ScottyLabs&apos; GenAI Hackathon by Nov. 1st!
                        </span>
                    </span>
                    <span className="welcome-banner__text--short">
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSd6mXSOzxxUctc0EeQBTanqebc31xmBnKb_cFRosqHjtmuemg/viewform"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Register
                        </a>{' '}
                        for Nova by Nov. 1st!
                    </span>
                </div>
                <div className="welcome-banner__close welcome-banner-padding welcome-banner-padding--button">
                    <button type="button" aria-label="close-banner" onClick={closeBanner}>
                        <img src={closeButton} alt="" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
export default App;