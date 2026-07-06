import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoutes';
import ProfileUpload from './components/ProfileUpload';
import Navbar from './components/Navbar';

function App() {
  // 1. Global state for the Navbar avatar
  const [userImageUrl, setUserImageUrl] = useState("");
  const navigate = useNavigate();

  // 2. Secure logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    // If you store other user data, remove it here too (e.g., localStorage.removeItem('user'))
    setUserImageUrl(""); // Clear the avatar state
    navigate('/login');  // Instantly redirect back to the login page
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Root path automatically redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* The Profile route is wrapped securely */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            {/* 3. A container to hold the protected layout */}
            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
              
              {/* 4. Navbar sits exactly at the top of the protected page */}
              <Navbar profilePicture={userImageUrl} onLogout={handleLogout} />
              
              {/* 5. Padding ensures the fixed Navbar doesn't cover your content */}
              <div style={{ paddingTop: '80px', paddingBottom: '40px' }}>
                <Profile />
                
                {/* 6. Pass the state updater so Navbar updates when upload finishes */}
                <ProfileUpload onUploadSuccess={(newUrl) => setUserImageUrl(newUrl)} />
              </div>

            </div>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;