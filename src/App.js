import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListPage from "./pages/ListPage";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import queryLocations from "./util/queryLocations";
import { handleBeforeInstallPrompt, installApp, cancelInstall } from "./install";

import "./App.css";

function App() {
  // Load locations
  const [locations, setLocations] = useState([]);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    queryLocations().then((parsedLocations) => {
      if (parsedLocations != null) {
        setLocations(parsedLocations);
      }
    });
    // Register the beforeinstallprompt event listener
    window.addEventListener("beforeinstallprompt", (event) => handleBeforeInstallPrompt(event, showInstallPrompt, setShowInstallPrompt));
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeinstallprompt", (event) => handleBeforeInstallPrompt(event, showInstallPrompt, setShowInstallPrompt));
    };
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <div className="App">
        {
          showInstallPrompt && (
            <div className="install-prompt">
              <p>Do you want to install CMUEats?</p>
              <button onClick={() => installApp(setShowInstallPrompt)}>Install</button>
              <button onClick={() => cancelInstall(setShowInstallPrompt)}>Cancel</button>
            </div>
          )
          }
          <Routes>
            <Route
              path="/"
              element={<ListPage locations={locations} />}
            />
            <Route
              path="/map"
              element={<MapPage locations={locations} />}
            />
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </div>

        <Navbar />
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
