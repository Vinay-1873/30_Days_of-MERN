import React, { useState } from 'react';
import axios from 'axios';

const ProfileUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Tracks the live preview image
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Handle File Selection & Generate Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a temporary, local URL so the browser can display it instantly
      setPreviewUrl(URL.createObjectURL(file));
      setMessage(''); 
    }
  };

  // 2. Handle the Upload Submission
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please select an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', image); 

    try {
      setUploading(true);
      setMessage('');

      const token = localStorage.getItem('token'); 
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${token}`,      
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/upload/avatar', 
        formData, 
        config
      );

      setMessage('🎉 Upload successful!');
      
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || 'Something went wrong during upload'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Profile Picture</h2>
      
      {/* 3. The Circular Image Preview */}
      <div style={styles.avatarContainer}>
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" style={styles.avatar} />
        ) : (
          <div style={styles.placeholder}>No Image</div>
        )}
      </div>
      
      <form onSubmit={handleUpload} style={styles.form}>
        <input 
          type="file" 
          accept="image/png, image/jpeg, image/jpg" 
          onChange={handleFileChange} 
          style={styles.fileInput}
        />
        
        <button 
          type="submit" 
          disabled={uploading || !image}
          style={{
            ...styles.button,
            backgroundColor: (uploading || !image) ? '#cccccc' : '#007bff',
            cursor: (uploading || !image) ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? 'Uploading to Cloud...' : 'Upload Image'}
        </button>
      </form>

      {message && (
        <p style={{ ...styles.message, color: message.includes('successful') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

// --- Clean Inline Styles ---
const styles = {
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '350px',
    margin: '40px auto',
    textAlign: 'center',
    fontFamily: 'sans-serif'
  },
  title: {
    margin: '0 0 20px 0',
    color: '#333'
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #007bff'
  },
  placeholder: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
    border: '3px dashed #ccc'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  fileInput: {
    fontSize: '14px'
  },
  button: {
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  message: {
    marginTop: '15px',
    fontWeight: 'bold'
  }
};

export default ProfileUpload;