import React, { useState, useEffect } from "react";
import SideBar from "components/SideBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { styled, ThemeProvider } from "@mui/styles";

import { authService } from "../fbase";
import { signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, Timestamp } from "firebase/firestore";

import TwittCard from "components/TwittCard";

const drawerWidth = 240;
function Home() {
  const [loginUserEmail, setLoginUserEmail] = useState("");
  const [newContent, setNewContent] = useState("");
  const db = getFirestore();

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setLoginUserEmail(user.email);
      } else {
        setLoginUserEmail("");
      }
    });

    // const unsub = onSnapshot(doc(db, "twitts"), (doc) => {
    //   console.log("Current data: ", doc.data());
    // });
  }, []);

  const addTwitt = async (title, message) => {
    try {
      const twittData = {
        user: authService.currentUser.uid,
        title: title,
        message: message,
        photo: null,
        time: Timestamp.fromDate(new Date()),
      };

      const twittsDoc = doc(db, "twitts", "111111");
      const docRef = await setDoc(twittsDoc, twittData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onLogoutClick = (event) => {
    signOut(authService);
  };

  const handleChange = (event) => {
    setNewContent(event.target.value);
  };

  const onAddClick = async (event) => {
    addTwitt("Title1111111", "Msg2222222");

    try {
      const userData = {
        email: authService.currentUser.email,
        name: null,
        nickname: null,
        photo: null,
      };

      // addUserToDb(data);
      const usersDoc = doc(db, "users", authService.currentUser.uid);
      const docRef = await setDoc(usersDoc, userData);

      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <div style={{ float: "top", background: "#1572A1" }}>Top bar</div>
      <div style={{ float: "left", background: "#F5EEDC" }}>
        <SideBar />
      </div>
      <Container component="main" maxWidth="xs">
        <h1>Home</h1>
        <h2>{loginUserEmail}</h2>
        <Button type="submit" variant="contained" onClick={onLogoutClick}>
          Logout
        </Button>

        {/* <TextField
        id="outlined-multiline-static"
        label="Multiline"
        multiline
        rows={4}
        defaultValue="Default Value"
        value={newContent}
        onChange={handleChange}
      /> */}

        <Button variant="contained" onClick={onAddClick}>
          Add
        </Button>

        <TwittCard userName="111111111" content="Hello!!" />
        <br />
        <TwittCard userName="111111111" content="Hello!!" />
        <br />
        <TwittCard userName="111111111" content="Hello!!" />
        <br />
        <TwittCard userName="111111111" content="Hello!!" />
        <br />
        <TwittCard userName="111111111" content="Hello!!" />
        <br />
      </Container>
    </div>
  );
}

export default Home;
