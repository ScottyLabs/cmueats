import React, { useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ListPage from './pages/ListPage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';
import { getLocationStatus } from './util/queryLocations';
import './App.css';
import { ILocation_FromAPI, ILocation_Full } from './types/locationTypes';
import { useUserCardViewPreferences } from './util/storage';
import useRefreshWhenBackOnline from './util/network';
import { $api } from './api';
import toTitleCase from './util/string';
import { useCurrentTime } from './contexts/NowContext';
import { useUserLocation } from './contexts/UserLocationContext';
import { getLocationDistanceFromUser } from './util/geoDistance';
import AuthBanner from './components/banners/AuthBanner';
import AlertBanner from './components/banners/OfflineAlertBanner';

export default function App() {
    const now = useCurrentTime();
    const { userCoordinates } = useUserLocation();
    // Load locations
    const { data, error } = $api.useQuery('get', '/v2/locations');
    const locations = useMemo(
        () =>
            data?.map((location) => ({
                ...location,
                name: toTitleCase(location.name ?? 'Untitled'), // Convert names to title case
            })) satisfies ILocation_FromAPI[] | undefined,
        [data],
    );

    const [cardViewPreferences, setCardViewPreferences] = useUserCardViewPreferences();
    useRefreshWhenBackOnline();

    const distanceFromUserMetersByLocationId = useMemo(() => {
        if (!locations) return undefined;
        const out: Record<string, number | null> = {};
        if (userCoordinates === null) {
            for (const location of locations) {
                out[location.id] = null;
            }
            return out;
        }
        for (const location of locations) {
            out[location.id] = getLocationDistanceFromUser(location, userCoordinates) ?? null;
        }
        return out;
    }, [locations, userCoordinates]);

    const fullLocationData: ILocation_Full[] | undefined = useMemo(() => {
        if (!locations || !distanceFromUserMetersByLocationId) return undefined;
        return locations.map((location) => ({
            ...location,
            ...getLocationStatus(location.times, now),
            cardViewPreference:
                cardViewPreferences[location.id] ?? cardViewPreferences[location.conceptId ?? ''] ?? 'normal', // check for conceptid preference as well, fallback
            distanceFromUserMeters: distanceFromUserMetersByLocationId[location.id] ?? null,
        }));
    }, [locations, now, cardViewPreferences, distanceFromUserMetersByLocationId]);

    return (
        <React.StrictMode>
            <BrowserRouter>
                <div className="App">
                    {/* <GeneralBanner
                        desktopText="How's your food? Tap on a card to leave a review!"
                        mobileText="Leave a review!"
                        localStorageKey="review-sys26-banner-closed"
                    /> */}
                    <AlertBanner />
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
            <Toaster position="bottom-right" toastOptions={{ className: 'toast' }} />
        </React.StrictMode>
    );
}
