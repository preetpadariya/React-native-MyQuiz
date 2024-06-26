import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getUserByPhonePassword,
  updateUser,
  initDatabase,
} from './database';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await initDatabase(); // Initialize database
        const storedUser = await getUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (phone, password) => {
    try {
      const user = await getUserByPhonePassword(phone, password);
      if (user) {
        setUser(user);
        await storeUserInStorage(user); // Store user data locally
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    await removeUserFromStorage(); // Remove user data from local storage
  };

  const fetchUser = async () => {
    const storedUser = await getUserFromStorage(); // Fetch user data from local storage
    setUser(storedUser);
  };

  const updateUserProfile = async (id, name, phone, password, image) => {
    try {
      await updateUser(id, name, phone, password, image);
      const updatedUser = { id, name, phone, password, image };
      setUser(updatedUser);
      await storeUserInStorage(updatedUser); // Update local storage
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchUser, updateUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Helper functions to handle local storage (example using AsyncStorage)
const getUserFromStorage = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user from storage:', error);
    return null;
  }
};

const storeUserInStorage = async (user) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user in storage:', error);
  }
};

const removeUserFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user from storage:', error);
  }
};
