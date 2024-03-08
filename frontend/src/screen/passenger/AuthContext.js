import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await SecureStore.getItemAsync('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    fetchUser();
  }, []);


  const login = async (userData) => {
    setUser(userData);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    console.log('user login:',userData)
  };
//   console.log('login data',userData)

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync('user');
    console.log('user logout',setUser(null))
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
