import {Link as RouterLink} from "react-router-dom";
import {Box} from "@mui/material";
import React from "react";
import {ErrorTitle, ErrorText, ErrorButton} from "../style";


function NotFoundPage() {
  return (
    <Box textAlign='center' mt={12} mb={12}>
      <ErrorTitle variant="h2">Oops!</ErrorTitle>
      <ErrorText>We couldn’t find the page you are looking for.</ErrorText>
      <ErrorButton component={RouterLink} to="/">
        Home page
      </ErrorButton>
    </Box>
  );
}

export default NotFoundPage;
