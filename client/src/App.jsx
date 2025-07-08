import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SignupModule from "./pages/SignUp.jsx";
import LoginModule from "./pages/Login.jsx";
import LandingModule from "./pages/Landing.jsx";

function App() {
  return (
    <Router>
      <div>
        <div></div>
        <div>
          {" "}
          <Routes>
            <Route path="/signup" element={<SignupModule />} />
            <Route path="/login" element={<LoginModule />} />
            <Route path="/" element={<LandingModule/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
