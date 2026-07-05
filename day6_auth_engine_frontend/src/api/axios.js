import axios from 'axios';

const API = axios.create({
  // Point this to your Express backend port
  baseURL: 'http://localhost:5000/api', 
});

// Intercept all outgoing requests
API.interceptors.request.use((req) => {
  //this Grab the token from the browser's local storage
  const token = localStorage.getItem('token');
  
  if (token) {
    // If a token exists, attach it to the headers exactly how the backend expects it
    req.headers.Authorization = `Bearer ${token}`;
  }
  
  return req;
});

export default API;