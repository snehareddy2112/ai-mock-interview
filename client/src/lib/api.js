import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN FROM STORAGE:", token); // Debug

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;