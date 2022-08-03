import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import SideBar from "components/SideBar";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { styled, ThemeProvider } from "@mui/styles";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { authService } from "../fbase";
import { signOut } from "firebase/auth";
import {
  collection,
  getFirestore,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";

import TwittCard from "components/TwittCard";

const drawerWidth = 240;
function Home() {
  const [currentUser, setCurrentUser] = useState();
  const [loginUserEmail, setLoginUserEmail] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [attachment, setAttachment] = useState();
  const [twitts, setTwitts] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setLoginUserEmail(user.email);
        setCurrentUser(user);
      } else {
        setLoginUserEmail("");
        setCurrentUser(null);
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

  const addTwitt = async (title, message, imagePath) => {
    try {
      const twittData = {
        user: authService.currentUser.uid,
        title: title,
        message: message,
        photo: imagePath,
        time: Timestamp.fromDate(new Date()),
      };

      const twittsCollection = collection(db, "twitts");
      const docRef = await addDoc(twittsCollection, twittData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const uploadImage = async (imageFileString) => {
    const storage = getStorage();
    const imageRef = ref(storage, `${currentUser.uid}/${uuidv4()}`);
    var imageUrl;

    await uploadString(imageRef, imageFileString, "data_url").then(
      async (snapshot) => {
        console.log("Uploaded a data_url string!");

        await getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          imageUrl = downloadURL;
        });
      }
    );
    return imageUrl;
  };

  const handleLogoutSubmit = (event) => {
    console.log("onLogoutClick");
    signOut(authService);
  };

  const handleChangeMessage = (event) => {
    console.log("handleChangeMessage");
    setNewContent(event.target.value);
  };

  const handleChangeTitle = (event) => {
    console.log("handleChangeTitle");
    setNewTitle(event.target.value);
  };

  const handleDeleteAllClick = async (event) => {
    console.log("handleDeleteAllClick");
    const querySnapshot = await getDocs(collection(db, "twitts"));
    querySnapshot.forEach((twitt) => {
      deleteDoc(doc(db, "twitts", twitt.id));
    });
  };

  const handleAddPhoto = (event) => {
    console.log("handleAddPhoto");
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const handleAddClick = async (event) => {
    var downloadURL = "";

    if (attachment) {
      downloadURL = await uploadImage(attachment);
      console.log("downloadURL : " + downloadURL);
      setAttachment(null);
    }

    addTwitt(newTitle, newContent, downloadURL);

    setNewTitle("");
    setNewContent("");
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
        <Button type="submit" variant="contained" onClick={handleLogoutSubmit}>
          Logout
        </Button>

        {attachment && (
          <div>
            <img src={attachment} width="200px" height="200px" />
          </div>
        )}

        <TextField
          autoComplete="given-name"
          name="title"
          required
          fullWidth
          id="titleText"
          label="Title"
          margin="normal"
          value={newTitle}
          onChange={handleChangeTitle}
          autoFocus
        />
        <TextField
          id="outlined-multiline-static"
          label="Content"
          fullWidth
          multiline
          rows={4}
          defaultValue="Default Value"
          margin="dense"
          value={newContent}
          onChange={handleChangeMessage}
        />

        <Stack spacing={2} direction="row" marginTop={1}>
          <Button variant="contained" margin="normal" onClick={handleAddClick}>
            Add
          </Button>
          <Button variant="contained" component="label" margin="normal">
            Photo
            <input
              id={"file-input"}
              style={{ display: "none" }}
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleAddPhoto}
            />
          </Button>

          <Button
            variant="contained"
            margin="normal"
            onClick={handleDeleteAllClick}
          >
            Delete All
          </Button>
        </Stack>

        {twitts.map((twitt) => (
          <div key={twitt.id}>
            {/* {console.log(twwit)} */}
            <TwittCard srcTwitt={twitt} />
            <br />
          </div>
        ))}
      </Container>
    </div>
  );
}

export default Home;
