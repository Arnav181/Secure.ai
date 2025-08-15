import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import SignupModule from "./pages/SignUp.jsx";
import LoginModule from "./pages/Login.jsx";
import LandingModule from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import Laws from "./pages/Laws.jsx";
import Updates from "./pages/Updates.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/signup" element={<SignupModule />} />
          <Route path="/login" element={<LoginModule />} />
          <Route path="/landing" element={<LandingModule/>} />
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/laws" element={<Laws />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
