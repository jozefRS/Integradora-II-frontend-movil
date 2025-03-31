import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      // const userData = await AsyncStorage.getItem('user');
      setIsAuthenticated(!!token);
      // setUser(JSON.parse(userData));
    };
    checkToken();
  }, []);

  const login = async (token) => {
    await AsyncStorage.setItem('token', token);
    // await AsyncStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    // setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    // await AsyncStorage.removeItem('user');
    setIsAuthenticated(false);
    // setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
