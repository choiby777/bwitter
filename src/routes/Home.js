import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { authService } from "../fbase";

function Home() {
  const [loginUserEmail, setLoginUserEmail] = useState("");

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setLoginUserEmail(user.email);
      } else {
        setLoginUserEmail("");
      }
    });
  }, []);

  const onLogoutClick = (event) => {
    signOut(authService);
  };

  return (
    <div>
      <h1>Home</h1>
      <h2>{loginUserEmail}</h2>
      <Button type="submit" variant="contained" onClick={onLogoutClick}>
        Logout
      </Button>
    </div>
  );
}

export default Home;
