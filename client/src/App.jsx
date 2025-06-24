import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SignupModule from "./components/SignUp.jsx";

function App() {
  return (
    <Router>
      <div>
        <div></div>
        <div>
          {" "}
          <Routes>
            <Route path="/" element={((<Navbar />), (<SignupModule />))} />
            <Route path="/signup" element={<SignupModule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
