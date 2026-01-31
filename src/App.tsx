import React, { useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useQueries } from '@tanstack/react-query';
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
import THBanner from './components/banners/THBanner';
import AuthBanner from './components/banners/AuthBanner';
import AlertBanner from './components/banners/OfflineAlertBanner';

export default function App() {
    const now = useCurrentTime();
    // Load locations
    const { data, error } = $api.useQuery('get', '/v2/locations');
    const locations = data?.map((location) => ({
        ...location,
        name: toTitleCase(location.name ?? 'Untitled'), // Convert names to title case
    })) satisfies ILocation_FromAPI[] | undefined;

    const [cardViewPreferences, setCardViewPreferences] = useUserCardViewPreferences();
    useRefreshWhenBackOnline();

    const locationIds = useMemo(() => locations?.map((location) => location.id) ?? [], [locations]);

    const reviewSummaries = useQueries({
        queries: locationIds.map((locationId) =>
            $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
                params: { path: { locationId } },
            }),
        ),
    });

    const ratingMap = useMemo(() => {
        const averages: Record<string, { avg: number | null; count: number | null }> = {};
        reviewSummaries.forEach((summary, index) => {
            const locationId = locationIds[index];
            if (!locationId) return;
            const buckets = summary.data?.starData?.buckets ?? [];
            const count = buckets.reduce((total, bucket) => total + bucket, 0);
            averages[locationId] = {
                avg: summary.data?.starData?.avg ?? null,
                count: Number.isFinite(count) ? count : null,
            };
        });
        return averages;
    }, [reviewSummaries]); 
    
    const fullLocationData: ILocation_Full[] | undefined = locations?.map((location) => ({
        ...location,
        ...getLocationStatus(location.times, now),
        cardViewPreference:
            cardViewPreferences[location.id] ?? cardViewPreferences[location.conceptId ?? ''] ?? 'normal', // check for conceptid preference as well, fallback
        averageRating: ratingMap[location.id]?.avg ?? null,
        ratingCount: ratingMap[location.id]?.count ?? null,
    }));

    return (
        <React.StrictMode>
            <BrowserRouter>
                <div className="App">
                    <THBanner />
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