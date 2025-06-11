import React, { useContext, createContext, useState, useEffect } from "react";
import { ID } from 'react-native-appwrite';
import { account } from "./appwrite";

// Create context with default value
const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOperating, setIsOperating] = useState(false); // Prevent concurrent operations

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  console.log("user:", user);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      // User is not logged in - this is expected behavior
      console.log('User not authenticated:', error.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    if (isOperating) return { success: false, message: 'Operation in progress...' };
    
    setIsLoading(true);
    setIsOperating(true);
    
    try {
      // Create session
      await account.createEmailPasswordSession(email, password);
      
      // Get user data
      const userData = await account.get();
      setUser(userData);
      
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      // Handle specific Appwrite errors
      if (error.code === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 429) {
        errorMessage = 'Too many requests. Please try again later';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Login error:', error);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
      setIsOperating(false);
    }
  };

  // Signup function
  const signup = async (email, password, name = '') => {
    if (isOperating) return { success: false, message: 'Operation in progress...' };
    
    setIsLoading(true);
    setIsOperating(true);
    
    try {
      // Create account with optional name
      await account.create(ID.unique(), email, password, name);
      
      // Automatically log in after signup
      const loginResult = await login(email, password);

      console.log("loginResult:", loginResult)
      
      if (loginResult.success) {
        return { success: true, message: 'Account created successfully!' };
      } else {
        return { success: false, message: 'Account created but login failed. Please try logging in manually.' };
      }
    } catch (error) {
      let errorMessage = 'Signup failed';
      
      // Handle specific Appwrite errors
      if (error.code === 409) {
        errorMessage = 'User with this email already exists';
      } else if (error.code === 400) {
        errorMessage = 'Invalid email or password format';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Signup error:', error);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
      setIsOperating(false);
    }
  };

  // Logout function
  const logout = async () => {
    if (isOperating) return { success: false, message: 'Operation in progress...' };
    
    setIsOperating(true);
    
    try {
      await account.deleteSession('current');
      setUser(null);
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
    } finally {
      setIsOperating(false);
    }
  };

  // Reset password function
  const resetPassword = async (email, resetUrl) => {
    if (isOperating) return { success: false, message: 'Operation in progress...' };
    
    setIsOperating(true);
    
    try {
      // Use provided resetUrl or default
      const url = resetUrl || 'https://yourapp.com/reset-password'; // Replace with your actual URL
      await account.createRecovery(email, url);
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: error.message || 'Failed to send reset email' };
    } finally {
      setIsOperating(false);
    }
  };

  // Update user profile
  const updateProfile = async (name) => {
    if (isOperating) return { success: false, message: 'Operation in progress...' };
    
    setIsOperating(true);
    
    try {
      const updatedUser = await account.updateName(name);
      setUser(updatedUser);
      return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: error.message || 'Failed to update profile' };
    } finally {
      setIsOperating(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = user !== null;

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isOperating,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  // Ensure context is used within provider
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};