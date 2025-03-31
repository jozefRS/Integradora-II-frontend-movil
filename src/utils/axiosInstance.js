import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.106.115:8080/api', // Reemplaza con tu IP o URL
});

// Interceptor para agregar el token en cada request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // 'token' es la clave que guardaremos
    console.log('🧪 Token actual:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
