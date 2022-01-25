import React, { useState } from "react";
import { authService } from "fbase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import { getFirestore, setDoc, doc } from "firebase/firestore";

function SignUp() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const db = getFirestore();

  const addUserToDb = async (userData) => {
    try {
      const usersDoc = doc(db, "users", authService.currentUser.uid);
      const docRef = await setDoc(usersDoc, userData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    const email = data.get("userEmail");
    const password = data.get("password");
    try {
      let data = await createUserWithEmailAndPassword(
        authService,
        email,
        password
      );

      const user = data.user;

      const userData = {
        email: user.email,
        name: null,
        displayName: user.displayName,
        photo: null,
      };
      addUserToDb(userData);

      navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid container="container" spacing={2}>
          <Grid item="item" xs={12}>
            <Typography variant="h2" color="#146356" align="center">
              Sign Up
            </Typography>
          </Grid>

          <Grid item="item" xs={12}>
            <TextField
              autoComplete="given-name"
              name="userEmail"
              required="required"
              fullWidth="fullWidth"
              id="userEmail"
              label="Email Address"
              autoFocus="autoFocus"
            />
          </Grid>

          <Grid item="item" xs={12}>
            <TextField
              required="required"
              fullWidth="fullWidth"
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
            />
          </Grid>

          <Grid item="item" xs={6}>
            <Link to="/">
              <Button
                fullWidth="fullWidth"
                variant="contained"
                style={{
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
            </Link>
          </Grid>

          <Grid item="item" xs={6}>
            <Button
              type="submit"
              fullWidth="fullWidth"
              variant="contained"
              style={{
                textTransform: "none",
              }}
            >
              Ok
            </Button>
          </Grid>

          {errorMsg === "" ? null : (
            <Grid item="item" xs={12}>
              <Alert severity="error">{errorMsg}</Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default SignUp;
