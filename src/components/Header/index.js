import React from "react";
import "./style.css";
import { useEffect } from "react";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { LogoutOutlined } from "@ant-design/icons";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logged Out Successfully");
          navigate("/");
        })
        .catch((err) => {
          // An error happened.
          toast.error(err.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">Finacely</p>
      <p className="logo link" onClick={logoutFnc}>
        <LogoutOutlined /> Logout
      </p>
    </div>
  );
};

export default Header;
