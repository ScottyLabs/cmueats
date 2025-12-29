import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import ListPage from './pages/ListPage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';
import { getLocationStatus } from './util/queryLocations';
import './App.css';
import { ILocation_FromAPI, ILocation_Full } from './types/locationTypes';
import { useUserCardViewPreferences } from './util/storage';
import scottyDog from './assets/banner/scotty-dog.svg';
import closeButton from './assets/banner/close-button.svg';
import useLocalStorage from './util/localStorage';
import useRefreshWhenBackOnline from './util/network';
import { $api } from './api';
import toTitleCase from './util/string';
import { useCurrentTime } from './contexts/NowContext';
import AuthBanner from './components/AuthBanner';

function App() {
    const now = useCurrentTime();
    // Load locations
    const { data, error } = $api.useQuery('get', '/v2/locations');
    const locations = data?.map((location) => ({
        ...location,
        name: toTitleCase(location.name ?? 'Untitled'), // Convert names to title case
    })) satisfies ILocation_FromAPI[] | undefined;

    const [cardViewPreferences, setCardViewPreferences] = useUserCardViewPreferences();
    useRefreshWhenBackOnline();

    const fullLocationData: ILocation_Full[] | undefined = locations?.map((location) => ({
        ...location,
        ...getLocationStatus(location.times, now),
        cardViewPreference:
            cardViewPreferences[location.id] ?? cardViewPreferences[location.conceptId ?? ''] ?? 'normal', // check for conceptid preference as well, fallback
    }));

    return (
        <React.StrictMode>
            <BrowserRouter>
                <div className="App">
                    {/* <Banner /> */}
                    {/* <div className="AdBanner">
                            CMUEats is now up to date with the official dining website! Sorry for the inconvenience.
                            &gt;_&lt;
                        </div> */}
                    <AuthBanner />
                    <div className="MainContent">
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
                                        error={error !== null}
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
