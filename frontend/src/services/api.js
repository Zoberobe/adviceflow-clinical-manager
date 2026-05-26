import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BASE_URL = `${API_ROOT}/api/`;

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        throw error;
    }
);

api.interceptors.response.use(
    (response) => {
        return response; 
    },
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                const res = await axios.post(`${BASE_URL}token/refresh/`, { 
                    refresh: refreshToken 
                });
                
                localStorage.setItem('access_token', res.data.access);
                
                originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                localStorage.clear();
                globalThis.location.href = '/login';
                throw refreshError; 
            }
        }
        throw error; 
    }
);

export default api;