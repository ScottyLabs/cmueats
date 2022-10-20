import React from "react";
import { Typography, styled, Button, Box } from "@mui/material";


const ErrorTitle = styled(Typography)({
  color: "white",
  marginBottom: 12,
  fontSize: 24,
  fontFamily:
    '"Zilla Slab", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontWeight: 600,
});

const ErrorText = styled(Typography)({
  color: "#d4d4d8",
  marginBottom: 20,
  fontSize: 16,
});

const ErrorButton = styled(Button)({
  fontWeight: 600,
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  color: "white",
  backgroundColor: "#1D1F21",
  elevation: 30,
});

export default function EateryCard({
  onClear,
}) {
  return <Box textAlign='center' mt={6} mb={6}>
    <ErrorTitle variant="h2">No results found</ErrorTitle>
    <ErrorText>
      Try searching for a name (e.g. “Schatz”) or location (e.g. “Cohon”).
    </ErrorText>
    <ErrorButton onClick={onClear}>
      Clear search
    </ErrorButton>
  </Box>;
}
