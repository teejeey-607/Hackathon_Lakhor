import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children, navigation }) => {
  const [driveruser, setDriverUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await SecureStore.getItemAsync('driveruser');
      if (storedUser) {
        setDriverUser(JSON.parse(storedUser));
      }
    };

    fetchUser();
  }, []);


  const driverlogin = async (userData) => {
    setDriverUser(userData);
    await SecureStore.setItemAsync('driveruser', JSON.stringify(userData));
    console.log('driveruser driverlogin:',userData)
  };

  const driverlogout = async () => {
    setDriverUser(null);
    await SecureStore.deleteItemAsync('driveruser');
   
    console.log('driveruser driverlogout',setDriverUser(null))
  };

  return (
    <AuthContext.Provider value={{ driveruser, driverlogin, driverlogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
