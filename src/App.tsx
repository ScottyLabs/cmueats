import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DateTime } from 'luxon';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import ListPage from './pages/ListPage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';
import {
    queryLocations,
    getExtendedLocationData as getExtraLocationData,
    LocationChecker,
} from './util/queryLocations';
import './App.css';
import { IReadOnlyLocation_FromAPI_PostProcessed, IReadOnlyLocation_ExtraData_Map } from './types/locationTypes';
import { getPinnedIds, setPinnedIds } from './util/storage';
import env from './env';
import scottyDog from './assets/banner/scotty-dog.svg';
import closeButton from './assets/banner/close-button.svg';

const BACKEND_LOCATIONS_URL = `${env.VITE_API_URL}/locations`;

function App() {
    // Load locations
    const [locations, setLocations] = useState<IReadOnlyLocation_FromAPI_PostProcessed[]>();
    const [extraLocationData, setExtraLocationData] = useState<IReadOnlyLocation_ExtraData_Map>();
    useEffect(() => {
        queryLocations(BACKEND_LOCATIONS_URL).then((parsedLocations) => {
            setLocations(parsedLocations);
            setExtraLocationData(getExtraLocationData(parsedLocations, DateTime.now().setZone('America/New_York')));
            // set extended data in same render to keep the two things in sync
        });
    }, []);

    const [pinnedIds, setPinnedIdsState] = useState<Record<string, true>>(getPinnedIds());

    const updatePinnedIds = (newObj: Record<string, true>) => {
        setPinnedIds(newObj);
        setPinnedIdsState(newObj);
    };

    // periodically update extra location data
    useEffect(() => {
        const intervalId = setInterval(
            () => setExtraLocationData(getExtraLocationData(locations, DateTime.now().setZone('America/New_York'))),
            1000,
        );
        return () => clearInterval(intervalId);
    }, [locations]);

    // Auto-refresh the page when the user goes online after previously being offline
    useEffect(() => {
        function handleOnline() {
            if (navigator.onLine) {
                // Refresh the page
                window.location.reload();
            }
        }

        window.addEventListener('online', handleOnline);

        return () => window.removeEventListener('online', handleOnline);
    }, []);

    new LocationChecker(locations).assertExtraDataInSync(extraLocationData);

    return (
        <React.StrictMode>
            <BrowserRouter>
                <div className="App">
                    <div className="MainContent">
                        <Banner />
                        {/* <div className="AdBanner">
                            CMUEats is now up to date with the official dining website! Sorry for the inconvenience.
                            &gt;_&lt;
                        </div> */}
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <ListPage
                                        extraLocationData={extraLocationData}
                                        locations={locations}
                                        pinnedIds={pinnedIds}
                                        updatePinnedIds={updatePinnedIds}
                                    />
                                }
                            />
                            <Route
                                path="/map"
                                element={<MapPage locations={locations} extraLocationData={extraLocationData} />}
                            />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </div>
                    <Navbar />
                </div>
            </BrowserRouter>
        </React.StrictMode>
    );
}
function Banner() {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <motion.div className="welcome-banner-container" animate={{ height: isOpen ? 'auto' : 0 }}>
            <div className="welcome-banner">
                <div className="welcome-banner__text">
                    <span className="welcome-banner__text--long">
                        <img src={scottyDog} alt="" />
                        <span>
                            Interested in Tech/Design or want to help build the future of CMU Eats? Join{' '}
                            <a
                                href="https://tartanconnect.cmu.edu/scottylabs/club_signup"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Scottylabs
                            </a>
                            !
                        </span>
                    </span>
                    <span className="welcome-banner__text--short">
                        Interested in Tech/Design? Join{' '}
                        <a href="https://tartanconnect.cmu.edu/scottylabs/club_signup" target="_blank" rel="noreferrer">
                            Scottylabs
                        </a>
                        !{' '}
                        <button className="welcome-banner__close-mobile" onClick={() => setIsOpen(false)} type="button">
                            close
                        </button>
                    </span>
                </div>
                <button
                    className="welcome-banner__close"
                    type="button"
                    aria-label="close-banner"
                    onClick={() => setIsOpen(false)}
                >
                    <img src={closeButton} alt="" />
                </button>
            </div>
        </motion.div>
    );
}
export default App;
