import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "../fbase";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Loading() {
  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInit, setisInit] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      setisInit(true);
    });
  }, []);

  return (
    <div>{isInit ? <AppRouter isLoggedIn={isLoggedIn} /> : <Loading />}</div>
  );
}

export default App;
