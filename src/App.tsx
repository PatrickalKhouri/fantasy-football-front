import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicRoute from './components/PublicRoute';
import ProtectedLayout from './components/ProtectedLayout';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Welcome from './pages/Welcome';
import League from './pages/League';
import { useGetCurrentUser } from './api/authQueries';
import AcceptInvite from './pages/AcceptInvite';
const App: React.FC = () => {
  const { data: currentUser } = useGetCurrentUser();
  return (
    <AuthProvider>
      <Router>
        <Navbar />
          <Routes>
            {/* Public routes - only signin/signup */}
            <Route element={<PublicRoute />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            <Route element={<ProtectedLayout />}>
              <Route path="/" element={
                <div className="App">
                  {/* Home page content will go here */}
                </div>
              } />
              <Route path="/welcome" element={<Welcome />} /> 
              <Route path="/league/:leagueId" element={<League currentUserId={currentUser?.id as number} />} />
              <Route path="/invite/accept" element={<AcceptInvite />} />
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;