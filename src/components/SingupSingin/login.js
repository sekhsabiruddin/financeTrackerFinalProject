import React, { useState } from "react";
import "./style.css";
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.js";
import GoogleButton from "react-google-button";
const Login = ({ toggleTheLoginAndSing }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Function to handle login using email and password
  function loginUsingEmail() {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // toast.success("User Logged in");
          // Do something with the logged-in user, e.g., redirect to the dashboard
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fields are mandatory");
    }
  }

  const handlePasswordVisibilityToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="form">
      <div className="container">
        <div className="box">
          <h2>Login</h2>
        </div>
        <div className="box">
          <GoogleButton
            style={{
              width: "100%",
              marginTop: "10px",
              marginBottom: "15px",
              fontFamily: "Helvetica",
            }}
          />
        </div>

        <div className="input-box">
          <span>
            <FaEnvelope className="icon" />
          </span>
          <input
            type="text"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <small>Please enter a valid Email</small> */}
        </div>

        <div className="input-box">
          <span>
            <FaLock className="icon" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={handlePasswordVisibilityToggle}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {/* <small>
            Password should have 1 small letter, 1 capital letter, and 1 number
          </small> */}
        </div>

        <div className="input-box">
          <button
            className="create_btn"
            style={{
              cursor: "pointer",
            }}
            onClick={loginUsingEmail}
          >
            Login Now
          </button>
        </div>

        <div className="input-box">
          <h6>
            Don't have an Account?
            <a
              style={{
                color: "#2870FF",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => toggleTheLoginAndSing()}
            >
              Sign up Here
            </a>
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Login;
