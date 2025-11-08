import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DateTime } from 'luxon';
import { motion } from 'motion/react';
import { ErrorBoundary } from 'react-error-boundary';
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
import useLocalStorage from './util/localStorage';
import bocchiError from './assets/bocchi-error.webp';

const BACKEND_LOCATIONS_URL = `${env.VITE_API_URL}/locations`;
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
            <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                <BrowserRouter>
                    <div className="App">
                        {/* <Banner /> */}
                        {/* <div className="AdBanner">
                            CMUEats is now up to date with the official dining website! Sorry for the inconvenience.
                            &gt;_&lt;
                        </div> */}
                        <div className="MainContent">
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
            </ErrorBoundary>
        </React.StrictMode>
    );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
function Banner() {
    const [closed, setIsClosed] = useLocalStorage('welcome-banner-closed');
    const closeBanner = () => {
        setIsClosed('true');
    };

    return (
        <motion.div
            className="welcome-banner-container"
            animate={{ height: closed === null ? 'auto' : 0 }}
            initial={{ height: closed === null ? 'auto' : 0 }}
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
