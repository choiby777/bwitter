import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { authService } from "fbase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

import { Link } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const db = getFirestore();

  useEffect(() => {}, [errorMsg]);

  const addUserToDb = async (userData) => {
    try {
      const usersDoc = doc(db, "users", authService.currentUser.uid);
      const docRef = await setDoc(usersDoc, userData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onGoogleLogin = async (event) => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authService, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        //console.log(user);
        const userData = {
          email: user.email,
          name: null,
          displayName: user.displayName,
          photo: null,
        };

        addUserToDb(userData);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorMessage);
        setErrorMsg(error.message);
      });
  };

  const onEmailLogin = async (event) => {
    signInWithEmailAndPassword(authService, email, password)
      .then((userCredential) => {
        // Signed in
        //const user = userCredential.user;
        // console.log(user);
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        setErrorMsg(error.message);
      });
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary" align="center">
                Sign in
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="userEmail"
                required
                fullWidth
                id="userEmail"
                label="Email Address"
                value={email}
                onChange={onChange}
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={onChange}
                autoComplete="new-password"
              />
            </Grid>

            {errorMsg === "" ? null : (
              <Grid item xs={12}>
                <Alert severity="error">{errorMsg}</Alert>
              </Grid>
            )}

            <Grid item xs={4}>
              <Button
                onClick={onGoogleLogin}
                fullWidth
                variant="contained"
                style={{ textTransform: "none" }}
              >
                Google
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                onClick={onEmailLogin}
                fullWidth
                variant="contained"
                style={{ textTransform: "none" }}
              >
                E-mail
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ textTransform: "none" }}
              >
                Github
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Link to="/signup">
                <Button fullWidth variant="contained">
                  Create Account
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
