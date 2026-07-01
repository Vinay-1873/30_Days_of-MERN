import axios from "axios";
const api = axios.create({
  baseURL: 'http://localhost:5000/api/task', 
});

export default api;