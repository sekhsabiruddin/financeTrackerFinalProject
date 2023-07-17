import React from "react";
import TransactionImg from "../assets/transaction.svg";

const NoTransaction = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBottom: "2rem",
      }}
    >
      <img
        src={TransactionImg}
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "4rem",
          padding: "0 2rem",
        }}
        alt=""
      />
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
        You Have No Transactions Currently
      </p>
    </div>
  );
};

export default NoTransaction;
