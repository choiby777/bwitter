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
import {
  collection,
  getFirestore,
  addDoc,
  setDoc,
  getDoc,
  doc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";

import TwittCard from "components/TwittCard";

const drawerWidth = 240;
function Home() {
  const [loginUserEmail, setLoginUserEmail] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [twitts, setTwitts] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setLoginUserEmail(user.email);
      } else {
        setLoginUserEmail("");
      }
    });
    setTwittsFromDb();
  }, []);

  const setTwittsFromDb = async () => {
    const twittsRef = collection(db, "twitts");
    const snapshot = await onSnapshot(twittsRef, (querySnapshot) => {
      const newTwittts = [];
      querySnapshot.forEach((doc) => {
        newTwittts.push({ id: doc.id, ...doc.data() });
      });

      setTwitts(newTwittts);
    });
  };

  const addTwitt = async (title, message) => {
    try {
      const twittData = {
        user: authService.currentUser.uid,
        title: title,
        message: message,
        photo: null,
        time: Timestamp.fromDate(new Date()),
      };

      const twittsCollection = collection(db, "twitts");
      const docRef = await addDoc(twittsCollection, twittData);
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

  const onChangeTitle = (event) => {
    setNewTitle(event.target.value);
  };

  const onAddClick = async (event) => {
    addTwitt(newTitle, newContent);

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

        <TextField
          autoComplete="given-name"
          name="title"
          required
          fullWidth
          id="titleText"
          label="Title"
          value={newTitle}
          onChange={onChangeTitle}
          autoFocus
        />
        <TextField
          id="outlined-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          defaultValue="Default Value"
          value={newContent}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={onAddClick}>
          Add
        </Button>

        {twitts.map((twwit) => (
          <div key={twwit.id}>
            {console.log(twwit)}
            <TwittCard userName={twwit.title} content={twwit.message} />
            <br />
          </div>
        ))}
      </Container>
    </div>
  );
}

export default Home;
