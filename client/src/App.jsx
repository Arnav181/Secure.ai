import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext";

import SignupModule from "./pages/SignUp.jsx";
import LoginModule from "./pages/Login.jsx";
import LandingModule from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import Laws from "./pages/Laws.jsx";
import Updates from "./pages/Updates.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/signup" element={<SignupModule />} />
            <Route path="/login" element={<LoginModule />} />
            <Route path="/landing" element={<LandingModule />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
            <Route path="/laws" element={<ProtectedRoute element={<Laws />} />} />
            <Route path="/updates" element={<ProtectedRoute element={<Updates />} />} />
            <Route path="/about" element={<ProtectedRoute element={<About />} />} />
            <Route path="/contact" element={<ProtectedRoute element={<Contact />} />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
