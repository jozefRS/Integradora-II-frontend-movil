import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.67:8080', // ✅ SIN /api para permitir rutas como /auth/login
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agrega el token automáticamente si está disponible
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    console.log('🧪 Token actual:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
