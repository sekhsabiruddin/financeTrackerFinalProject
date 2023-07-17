import "./App.css";
import Header from "./components/Header";
import Singup from "./pages/Singup";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Singup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
