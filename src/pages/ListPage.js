import { Typography, Grid, styled } from "@mui/material"; // Alert (add to imports when creating announcement)
import React, { useEffect, useMemo, useState, useLayoutEffect } from "react";
import EateryCard from "../components/EateryCard";
import NoResultsError from "../components/NoResultsError";
import getGreeting from "../util/greeting";
import "./ListPage.css";

function ListPage({ locations }) {
  const greeting = useMemo(() => getGreeting(), []);

  // Search query processing
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (e) => setSearchQuery(e.target.value);

  const [filteredLocations, setFilteredLocations] = useState([]);
  useLayoutEffect(() => {
    const filteredSearchQuery = searchQuery.trim().toLowerCase();

    setFilteredLocations(
      filteredSearchQuery.length === 0
        ? locations
        : locations.filter(({ name, location, shortDescription }) => {
          return name.toLowerCase().includes(filteredSearchQuery)
            || location.toLowerCase().includes(filteredSearchQuery)
            || shortDescription.toLowerCase().includes(filteredSearchQuery);
        })
    );
  }, [searchQuery, locations]);

  const openLocations = filteredLocations.filter((location) => location.isOpen);
  const closedLocations = filteredLocations.filter((location) => !location.isOpen);
  
  // const [showAlert, setShowAlert] = useState(true);

  // Load the search query from the URL, if any
  useEffect(() => {
    const urlQuery = new URLSearchParams(window.location.search).get('search');
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, []);

  // Typography
  const HeaderText = styled(Typography)({
    color: "white",
    padding: 0,
    fontFamily:
      '"Zilla Slab", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: 800,
    fontSize: "3em",
  });

  const LogoText = styled(Typography)({
    color: "#dd3c18",
    padding: 0,
    fontFamily:
      '"Zilla Slab", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: 800,
  });

  const FooterText = styled(Typography)({
    color: "white",
    marginBottom: 20,
    fontSize: 16,
  });

  /* const StyledAlert  = styled(Alert)({
    backgroundColor: '#23272a',
    color: '#ffffff',
  }); */

  return (
    <div className="ListPage">
       { /*  showAlert && 
      <StyledAlert severity="info" className="announcement" onClose={() => setShowAlert(false)}>
        🚧 [Issue Description] 
        Please remain patient while we work on a fix. Thank you. 🚧
      </StyledAlert>  */}
      <div className="Container">
        <header className="Locations-header">
          <HeaderText variant="h3">{greeting}</HeaderText>
          <input
            className="Locations-search"
            type="search"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="Search"
          />
        </header>

        {
          (filteredLocations.length === 0 && locations.length !== 0) &&
          <NoResultsError onClear={e => setSearchQuery('')} />
        }

        <Grid container spacing={2}>
          {openLocations.map(location => <EateryCard location={location} key={location.conceptId} />)}
        </Grid>
        <br></br>
        <Grid container spacing={2}>
          {closedLocations.map(location => <EateryCard location={location} key={location.conceptId} />)}
        </Grid>
      </div>
      <footer className="footer">
        <FooterText>
          All times displayed in Pittsburgh local time (ET)
        </FooterText>
        <FooterText>
          Contact{" "}
          <a href="mailto:gramliu@cmu.edu" style={{ color: "white" }}>
            Gram
          </a>
          ,{" "}
          <a href="mailto:anuda@cmu.edu" style={{ color: "white" }}>
            Anuda
          </a>
          , or{" "}
          <a href="mailto:dsyou@andrew.cmu.edu" style={{ color: "white" }}>
            David
          </a>{" "}
          with any problems
        </FooterText>
        <LogoText variant="h4">
          cmu<span style={{ color: "#19b875" }}>:eats</span>
        </LogoText>
      </footer>
    </div>
  );
}

export default ListPage;
