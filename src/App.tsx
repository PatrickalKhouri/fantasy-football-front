import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={
          <div className="App">
            <Navbar />
            {/* Home page content will go here */}
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;