import React from "react";
import Header from "../components/Header";
import SingupSingin from "../components/SingupSingin";
const Singup = () => {
  return (
    <div>
      <Header />
      <div className="wrapper">
        <SingupSingin />
      </div>
    </div>
  );
};

export default Singup;
