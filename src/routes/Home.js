import React, { useState, useEffect } from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { signOut } from "firebase/auth";
import { authService } from "../fbase";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";

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

    console.log("Current 1111111");

    const unsub = onSnapshot(
      doc(db, "commis", "VfP11FhrEW1HnzYes5GJ"),
      (doc) => {
        console.log("Current data: ", doc.data());
      }
    );
  }, []);

  const onLogoutClick = (event) => {
    console.log("onLogoutClick");
    console.log("authService.uid :  ", authService.currentUser.uid);
    signOut(authService);
  };

  const onAddClick = async (event) => {
    try {
      console.log("authService.uid :  ", authService.currentUser.uid);
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
    <div>
      <h1>Home</h1>
      <h2>{loginUserEmail}</h2>
      <Button type="submit" variant="contained" onClick={onLogoutClick}>
        Logout
      </Button>
      <Button variant="contained" onClick={onAddClick}>
        Add
      </Button>
    </div>
  );
}

export default Home;
