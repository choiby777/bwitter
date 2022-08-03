import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions, TextField } from "@mui/material";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function TwittCard({ srcTwitt }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(srcTwitt.title);
  const [editMessage, setEditMessage] = useState(srcTwitt.message);
  const [twitt, setTwitt] = useState(srcTwitt);
  const db = getFirestore();

  const handleDeleteClick = (event) => {
    console.log("handleDeleteClick");

    const isOk = window.confirm("Are you sure want to delete this tweet?");
    if (isOk) {
      deleteDoc(doc(db, "twitts", twitt.id));
    }
  };

  const handleEditClick = (event) => {
    console.log("handleEditClick");
    setIsEditMode(true);
  };

  const handleSaveClick = async (event) => {
    console.log("handleSaveClick");

    const twittDoc = doc(db, "twitts", twitt.id);

    await updateDoc(twittDoc, {
      title: editTitle,
      message: editMessage,
    });

    setIsEditMode(false);
  };

  const handleChangeMessage = (event) => {
    console.log("handleChangeMessage");
    setEditMessage(event.target.value);
  };

  const handleChangeTitle = (event) => {
    console.log("handleChangeTitle");
    setEditTitle(event.target.value);
  };

  const styles = {
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9,
      marginTop: "30",
    },
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={
            twitt.photo === ""
              ? "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg"
              : twitt.photo
          }
        />
        {isEditMode ? (
          <CardContent>
            <TextField
              autoComplete="given-name"
              name="title"
              required
              fullWidth
              id="titleText"
              label="Title"
              margin="normal"
              defaultValue={editTitle}
              value={editTitle}
              onChange={handleChangeTitle}
              autoFocus
            />
            <TextField
              id="outlined-multiline-static"
              label="Content"
              fullWidth
              multiline
              rows={4}
              margin="dense"
              defaultValue={editMessage}
              value={editMessage}
              onChange={handleChangeMessage}
            />
          </CardContent>
        ) : (
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {twitt.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {twitt.message}
            </Typography>
          </CardContent>
        )}
      </CardActionArea>
      <CardActions>
        {isEditMode ? (
          <Button size="small" color="primary" onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <Button size="small" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
        )}
        <Button size="small" color="primary" onClick={handleDeleteClick}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
