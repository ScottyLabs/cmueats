import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DateTime } from 'luxon';
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

function App() {
    // Load locations
    const [locations, setLocations] = useState<IReadOnlyLocation_FromAPI_PostProcessed[]>();
    const [extraLocationData, setExtraLocationData] = useState<IReadOnlyLocation_ExtraData_Map>();
    useEffect(() => {
        queryLocations(`${env.VITE_API_URL}/locations`).then((parsedLocations) => {
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

export default App;
