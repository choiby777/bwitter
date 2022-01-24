import React, { useState } from "react";
import Home from "routes/Home";
import SignIn from "routes/SignIn";
import SignUp from "routes/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRouter({ isLoggedIn }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        {isLoggedIn ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<SignIn />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
