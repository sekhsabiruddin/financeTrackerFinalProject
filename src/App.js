import "./App.css";
import Singup from "./pages/Singup";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Singup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer /> {/* Add the ToastContainer component here */}
    </Router>
  );
}

export default App;
