import React from 'react';

const Navbar = ({ profilePicture, onLogout }) => {
  return (
    <nav style={styles.navbar}>
      {/* Left side: App Branding */}
      <div style={styles.brand}>
        <h2>Auth Engine</h2>
      </div>

      {/* Right side: User Profile & Logout */}
      <div style={styles.userSection}>
        {profilePicture ? (
          <img src={profilePicture} alt="User Avatar" style={styles.avatar} />
        ) : (
          <div style={styles.placeholderAvatar}>👤</div>
        )}
        
        <button onClick={onLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box',
    // Ensures it sits at the very top of the page
    position: 'fixed', 
    top: 0,
    left: 0,
    zIndex: 1000
  },
  brand: {
    color: '#333',
    margin: 0
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px' // Space between image and button
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #007bff'
  },
  placeholderAvatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    border: '2px solid #ccc'
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  }
};

export default Navbar;