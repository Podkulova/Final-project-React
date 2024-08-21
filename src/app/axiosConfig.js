import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://edupage.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Přidání tokenu do každého požadavku
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;