import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DateTime } from "luxon";

import Navbar from "./components/Navbar";
import ListPage from "./pages/ListPage";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import { queryLocations, getLocationStatus } from "./util/queryLocations";
import "./App.css";
import {
  IReadOnlyExtendedLocation,
  IReadOnlyLocation,
} from "./types/locationTypes";

const CMU_EATS_API_URL = "https://dining.apis.scottylabs.org/locations";
// const CMU_EATS_API_URL = 'http://localhost:5173/example-response.json'; // for debugging purposes (note that you need an example-response.json file in the /public folder)
// const CMU_EATS_API_URL = 'http://localhost:5010/locations'; // for debugging purposes (note that you need an example-response.json file in the /public folder)
function App() {
  // Load locations
  const [locations, setLocations] = useState<IReadOnlyLocation[]>();
  const [extendedLocationData, setExtendedLocationData] =
    useState<IReadOnlyExtendedLocation[]>();
  useEffect(() => {
    queryLocations(CMU_EATS_API_URL).then((parsedLocations) => {
      setLocations(parsedLocations);
    });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(
      (function updateExtendedLocationData() {
        if (locations !== undefined) {
          // Remove .setZone('America/New_York') and change time in computer settings when testing
          // Alternatively, simply set now = DateTime.local(2023, 12, 22, 18, 33); where the parameters are Y,M,D,H,M
          const now = DateTime.now().setZone("America/New_York");
          setExtendedLocationData(
            locations.map((location) => ({
              ...location,
              ...getLocationStatus(location.times, now), // populate location with more detailed info relevant to current time
            })),
          );
        }
        return updateExtendedLocationData; // returns itself here
      })(), // self-invoking function
      5 * 1000, // updates every 5 seconds
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

    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <div className="App">
          <div className="MainContent">
            <Routes>
              <Route
                path="/"
                element={<ListPage locations={extendedLocationData} />}
              />
              <Route
                path="/map"
                element={<MapPage locations={extendedLocationData} />}
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
