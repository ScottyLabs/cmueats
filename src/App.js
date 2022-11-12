import React, { useEffect, useState } from "react";
import {createRoutesFromElements, createBrowserRouter, Route, RouterProvider} from "react-router-dom";
import ListPage from "./pages/ListPage";
import queryLocations from "./util/queryLocations";
import "./App.css";

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
      <Route
        path="/"
        element={<ListPage locations={locations} />}
      />
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
