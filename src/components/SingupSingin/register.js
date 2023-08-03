import React, { useState } from "react";
import "./style.css";
import validator from "validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGooglePlusG } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import Input from "../Input";
import Button from "../Button/index";
import { auth, db, provider } from "../../firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Register from "./register.js";
import Login from "./login.js";
import GoogleButton from "react-google-button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
const SignUpForm = ({ toggleTheLoginAndSing }) => {
  const navigate = useNavigate();
  const handlePasswordVisibilityToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleConfirmPasswordVisibilityToggle = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  //=====================singuppagevalidOrNot===========================>
  function isSingUpPageValidOrNot() {
    let isError = false;
    const errors = {};
    if (!fullName) {
      isError = true;
      errors.fullName = "Full name is required";
    }
    if (!email) {
      isError = true;
      errors.email = "Email address is required";
    } else if (!validator.isEmail(email)) {
      isError = true;
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      isError = true;
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password length shoulb be 6 character";
    }
    if (!confirmPassword) {
      isError = true;
      errors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      isError = true;
      errors.confirmPassword = "Passwords do not match";
    }

    if (isError) {
      // If there are errors, update the state with the error messages
      setErrors(errors);
      return false;
    } else {
      // Clear any existing errors if the form is valid
      setErrors({});
      return true;

      // Perform any other form submission logic here (e.g., API calls, etc.)
      // For simplicity, this example doesn't include actual form submission handling.
    }
  }
  //create Doc funtion

  async function createDoc(user) {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: fullName, // Use fullName instead of name
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created");
      } catch (e) {
        toast.error(e.message);
      }
    } else {
      toast.error("Doc already exists");
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSingUpPageValidOrNot()) {
      console.log("logged sucees");
      signupWithEmailandPassword();
    }
  };
  //=============================>singupwithEmailandPassword<======================
  function signupWithEmailandPassword() {
    if (true) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          //signed in user
          const user = userCredential.user;
          toast.success("user created");
          setFullName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          // setLoading(false);
          // createDoc(user);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMeassage = error.message;
          toast.error(errorMeassage);
          // setLoading(false);
        });
    } else {
      toast.error("All fields are are madatory");
      // setLoading(false);
    }
  }
  //end
  const eyeIcon = showPassword ? faEye : faEyeSlash;
  const confirmEyeIcon = showConfirmPassword ? faEye : faEyeSlash;

  return (
    <div className="form">
      <div className="container">
        <div className="box">
          <h2>Create Account</h2>
        </div>
        <div className="box">
          {/* <FontAwesomeIcon className="icon" icon={faGooglePlusG} />
          <button className="gmail_btn">Login via Gmail</button> */}
          <GoogleButton
            style={{
              width: "100%",
              marginTop: "10px",
              fontFamily: "Helvetica",
            }}
          />
        </div>

        <div className="or-container">
          <hr className="line" />
          <span className="or-text">OR</span>
          <hr className="line" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <span>
              <FontAwesomeIcon className="icon" icon={faUser} />
            </span>
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={handleFullNameChange}
            />
            <small>{errors.fullName}</small>
          </div>

          <div className="input-box">
            <span>
              <FontAwesomeIcon className="icon" icon={faEnvelope} />
            </span>
            <input
              type="text"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
            />
            <small>{errors.email}</small>
          </div>

          <div className="input-box">
            <span>
              <FontAwesomeIcon className="icon" icon={faLock} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <FontAwesomeIcon
              className="eye-icon"
              icon={eyeIcon}
              onClick={handlePasswordVisibilityToggle}
            />
            <small>{errors.password}</small>
          </div>

          <div className="input-box">
            <span>
              <FontAwesomeIcon className="icon" icon={faLock} />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <FontAwesomeIcon
              className="eye-icon"
              icon={confirmEyeIcon}
              onClick={handleConfirmPasswordVisibilityToggle}
            />
            <small>{errors.confirmPassword}</small>
          </div>

          <div className="input-box">
            <button
              className="create_btn"
              style={{
                cursor: "pointer",
              }}
              type="submit"
            >
              Signup using Email and password
            </button>
          </div>
          <div className="input-box">
            <h6>
              Have an Account?{" "}
              <a
                style={{
                  color: "#2870FF",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onClick={() => toggleTheLoginAndSing()}
              >
                Log in
              </a>
            </h6>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
