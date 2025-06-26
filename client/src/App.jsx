import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SignupModule from "./components/SignUp.jsx";
import LoginModule from "./components/Login.jsx";

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
            <Route path="/login" element={<LoginModule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
