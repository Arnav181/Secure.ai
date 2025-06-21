import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import SignupModule from './components/SignUp.jsx'; // Adjust path if needed

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div> {/* Padding to offset navbar height */}
          <Routes>
            <Route path="/signup" element={<SignupModule />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
