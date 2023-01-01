import React, { lazy, useEffect, useState } from "react";
import {createRoutesFromElements, createBrowserRouter, Route, RouterProvider} from "react-router-dom";
import ListPage from "./pages/ListPage";
import queryLocations from "./util/queryLocations";
import "./App.css";
import NotFoundPage from "./pages/NotFoundPage";

const MapPage = lazy(() => import('./pages/MapPage'));

function App() {
  // Load locations
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    queryLocations().then((parsedLocations) => {
      if (parsedLocations != null) {
        setLocations(parsedLocations);
      }
    });
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
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
      </>
    )
  );

  return (
    <React.StrictMode>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </React.StrictMode>
  );
}

export default App;
