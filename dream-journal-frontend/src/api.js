import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);

// Dreams API
export const getDreams = (params) => api.get('/dreams', { params });
export const createDream = (dreamData) => api.post('/dreams', dreamData);
export const getDreamStats = () => api.get('/dreams/stats');
export const updateDream = (id, dreamData) => api.put(`/dreams/${id}`, dreamData);
export const deleteDream = (id) => api.delete(`/dreams/${id}`);

// Interpretations API
export const getRandomInterpretation = (keyword) => 
  api.get('/interpretations/random', { params: { keyword } });

export default api;