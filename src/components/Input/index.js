import React, { useState } from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Input({ type, label, state, setState, placeholder, password }) {
  console.log("passowrd is ", password);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Add the 'password' state variable

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateInput = () => {
    if (type === "email" && state && !/\S+@\S+\.\S+/.test(state)) {
      setErrorMessage("Please enter a valid email address");
    } else if (type === "name" && state.trim() === "") {
      setErrorMessage("Name field is required");
    } else if (type === "password" && state.length < 6) {
      setErrorMessage("Password should be at least 6 characters long");
    } else if (label === "Confirm Password" && state && state !== password) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  };

  const handleInputChange = (e) => {
    setState(e.target.value);
  };

  const handleBlur = () => {
    validateInput();
  };

  return (
    <div className="input-wrapper">
      <p className="label-input">{label}</p>
      <input
        type={showPassword ? "text" : type}
        value={state}
        placeholder={placeholder}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="custom-input"
      />
      {errorMessage && <small>{errorMessage}</small>}
      {(label === "Password" || label === "Confirm Password") && (
        <FontAwesomeIcon
          className="icon"
          icon={showPassword ? faEyeSlash : faEye}
          onClick={togglePasswordVisibility}
        />
      )}
    </div>
  );
}

export default Input;
