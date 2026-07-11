import React, { useState } from 'react';
import axios from 'axios';

const APP = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Handle File Selection and Generate Preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      // Create a temporary local URL for the preview image
      setPreview(URL.createObjectURL(selectedFile)); 
    }
  };

  // 2. Submit the File to the Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file first!');

    setLoading(true);

    // CRITICAL: We must use FormData for file uploads, not a standard JSON object
    const formData = new FormData();
    formData.append('avatar', file); // The name 'avatar' MUST match your multer config: upload.single('avatar')

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set the final URL returned from our backend to display the live image
      setUploadedImageUrl(response.data.filePath);
      alert('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Update Profile Picture</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Preview Circle */}
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={preview || 'https://via.placeholder.com/150'} 
            alt="Avatar Preview" 
            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ccc' }}
          />
        </div>

        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ marginBottom: '20px' }}
        />
        
        <br />
        
        <button type="submit" disabled={!file || loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? 'Uploading...' : 'Upload Avatar'}
        </button>
      </form>

      {/* Show the final URL returned from the server */}
      {uploadedImageUrl && (
        <div style={{ marginTop: '30px' }}>
          <h3>Live Image URL:</h3>
          <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
            {uploadedImageUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default APP;