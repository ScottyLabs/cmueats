import React, { useEffect, useState } from "react";
import queryLocations from "./util/queryLocations";
import ListPage from "./pages/ListPage";
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

  return (
    <div className="App">
      {/* <div className="announcement">
        🚧 There is an ongoing issue that is preventing us from retrieving the
        dining schedule. We are working on a fix. 🚧
      </div> */}
      <ListPage locations={locations} />
    </div>
  );
}

export default App;
