import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the transparency and color as needed
        backgroundColor: "transparent", // Add a blur effect to the background
      }}
    >
      <h1>Loading...</h1>
      <HashLoader color={"#000000"} loading={true} />{" "}
      {/* Set the color to black */}
    </div>
  );
};

export default Loader;
