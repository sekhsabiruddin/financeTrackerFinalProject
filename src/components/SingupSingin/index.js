import React from "react";
import "./style.css";
import { useState } from "react";
import Input from "../Input";
import Button from "../Button/index";
import { auth, db, provider } from "../../firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function SingupSinginComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState("");
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();
  //sin up using email and password
  function signupWithEmailandPassword() {
    setLoading(true);
    let valid = true;
    if (valid) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          //signed in user
          const user = userCredential.user;
          // console.log("user=>", user);
          toast.success("user created");
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setLoading(false);
          createDoc(user);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMeassage = error.message;
          toast.error(errorMeassage);
          setLoading(false);
        });
    } else {
      toast.error("All fields are are madatory");
      setLoading(false);
    }
  }

  //loginUsingEmail
  function loginUsingEmail() {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged in");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage, errorCode);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All field are madatory");
    }
  }

  //create Doc
  async function createDoc(user) {
    console.log("display", user.displayName);
    console.log("name", name);
    console.log("eamil", user.email);
    console.log("photoURL", user.photoURL);
    if (!user) return;
    console.log("hi");

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      console.log("exist");
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name, // Fixed typo: displayNane -> displayName
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "", // Fixed typo: pohotURL -> photoURL
          createdAt: new Date(),
        });

        toast.success("Doc created");
      } catch (e) {
        toast.error(e.message); // Fixed typo: meassage -> message
      }
    } else {
      toast.error("Doc already exists"); // Fixed typo: alredy -> already
    }
  }
  //signupWithGoogle with google
  function signupWithGoogle() {
    console.log("singupWithGoogle");
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success("User created");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setLoading(false);
        createDoc(user);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
      });
  }
  return (
    <>
      {loginForm ? (
        <div className="singup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder="johnDoe@gmail.com"
            />

            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder="Example@1234"
            />
            {/* */}
            <Button
              text={loading ? "Loading..." : "Login using Email"}
              onClick={loginUsingEmail}
            />
            <p style={{ textAlign: "center" }}>or</p>
            <Button
              text={loading ? "Loading..." : "Signup Using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ textAlign: "center", margin: 0 }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Have An Account? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="singup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form>
            <Input
              type="text"
              label={"Full name"}
              state={name}
              setState={setName}
              placeholder="John Doe"
            />

            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder="johnDoe@gmail.com"
            />

            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder="Example@1234"
            />

            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder="Re-enter password"
              password={password}
            />
            <Button
              text={loading ? "Loading..." : "Signup using Email and password"}
              onClick={signupWithEmailandPassword}
            />
            <p style={{ textAlign: "center" }}>or</p>
            <Button
              text={loading ? "Loading..." : "Signup Using Google"}
              blue={true}
              onClick={signupWithGoogle}
            />
            <p
              className="p-login"
              style={{ textAlign: "center", margin: 0 }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Have An Account Already? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}
export default SingupSinginComponent;
