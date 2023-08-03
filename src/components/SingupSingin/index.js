import React from "react";
import "./style.css";
import { useState } from "react";
import Input from "../Input";
import Button from "../Button/index";
import { auth, db, provider } from "../../firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Register from "./register.js";
import Login from "./login.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function SingupSinginComponent() {
  const [loginForm, setLoginForm] = useState(false);

  function toggleTheLoginAndSing() {
    setLoginForm(!loginForm);
  }

  return (
    <>
      {loginForm ? (
        <Login toggleTheLoginAndSing={toggleTheLoginAndSing} />
      ) : (
        <Register toggleTheLoginAndSing={toggleTheLoginAndSing} />
      )}
    </>
  );
}
export default SingupSinginComponent;
