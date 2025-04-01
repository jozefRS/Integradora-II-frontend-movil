import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');

      setIsAuthenticated(!!token);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    checkAuth();
  }, []);

  const login = async (responseData) => {
    const { token, email, rol } = responseData;
    const userData = {
      email,
      role: rol,
    };

    await AsyncStorage.setItem('token', token);
    console.log("🧪 Guardando token:", token); // Debug

    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
