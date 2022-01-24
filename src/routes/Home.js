import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/styles";
import { authService } from "../fbase";
import { signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import TwittCard from "components/TwittCard";

function Home() {
  const [loginUserEmail, setLoginUserEmail] = useState("");
  const db = getFirestore();

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setLoginUserEmail(user.email);
      } else {
        setLoginUserEmail("");
      }
    });

    const unsub = onSnapshot(
      doc(db, "commis", "VfP11FhrEW1HnzYes5GJ"),
      (doc) => {
        console.log("Current data: ", doc.data());
      }
    );
  }, []);

  const onLogoutClick = (event) => {
    signOut(authService);
  };

  const onAddClick = async (event) => {
    try {
      const docRef = await addDoc(collection(db, "commis"), {
        uid: authService.currentUser.uid,
        first: "Ada",
        last: "Lovelace",
        born: 1815,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <h1>Home</h1>
      <h2>{loginUserEmail}</h2>
      <Button type="submit" variant="contained" onClick={onLogoutClick}>
        Logout
      </Button>
      <Button variant="contained" onClick={onAddClick}>
        Add
      </Button>

      <TwittCard title="111111111" content="Hello!!" />
      <br />
      <TwittCard title="111111111" content="Hello!!" />
      <br />
      <TwittCard title="111111111" content="Hello!!" />
      <br />
    </Container>
  );
}

export default Home;
