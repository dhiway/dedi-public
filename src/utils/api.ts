import axios from "axios"

// Base API URL - you might want to get this from environment variables
const API_BASE_URL = import.meta.env.VITE_API_LOCAL_ENDPOINT

// Configure axios instance with default headers
const api = axios.create({
    baseURL: API_BASE_URL,
})
// Add request interceptor to include auth token in requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)
// Response interceptor for API calls
api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

export default api;
export { api };