import React, { useState } from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Input({ type, label, state, setState, placeholder, password }) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false); // New state variable for tracking focus
  // console.log("type", type);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateInput = () => {
    // Check the input type and state to validate the input.
    if (type === "name" && state.trim() === "") {
      setErrorMessage("Name field is required");
      return;
    } else if (type === "email" && state && !/\S+@\S+\.\S+/.test(state)) {
      setErrorMessage("Please enter a valid email address");
      return;
    } else if (type === "password" && state.length < 6) {
      setErrorMessage("Password should be at least 6 characters long");
      return;
    } else if (label === "Confirm Password" && state && state !== password) {
      setErrorMessage("Passwords do not match");
      return;
    } else {
      // If input is valid, clear any previous error message and set the form as valid.
      setErrorMessage("");
    }
  };

  const handleInputChange = (e) => {
    setState(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false); // When leaving the input, set isFocused to false
    validateInput();
  };

  const handleFocus = () => {
    setIsFocused(true); // When focusing on the input, set isFocused to true
    setErrorMessage(""); // Clear the error message when focusing on the input
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
        onFocus={handleFocus} // Add onFocus event handler
        className="custom-input"
      />
      {errorMessage && !isFocused && <small>{errorMessage}</small>}
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
