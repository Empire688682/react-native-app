import React, { useContext, createContext, useState, useEffect } from "react";
import { ID } from 'react-native-appwrite';
import { account } from "./appwrite";
import { useRouter } from "expo-router";

// Create context with default value
const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState("juwon");
  const [isLoading, setIsLoading] = useState(true);
   const router = useRouter()

  // Login function with better error handling
  const login = async (email, password) => {
    if (isOperating) return { success: false, message: 'Operation in progress...' };
    
    setIsLoading(true);
    setIsOperating(true);
    
    try {
      // First, try to delete any existing sessions to avoid conflicts
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore if no session exists
      }
      
      // Create new session
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
        errorMessage = 'Too many requests. Please try again in a few minutes';
      } else if (error.code === 400) {
        errorMessage = 'Invalid email or password format';
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

  // Optimized signup function
  const signup = async (email, password, name = '') => {
    if (isOperating) return { success: false, message: 'Operation in progress...' };
    
    setIsLoading(true);
    setIsOperating(true);
    
    try {
      // Create account with optional name
      await account.create(ID.unique(), email, password, name);
      
      // Wait a bit before attempting login to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set loading states for login attempt
      setIsLoading(true);
      setIsOperating(true);
      
      // Manually create session instead of calling login function
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      setUser(userData);
      
      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      let errorMessage = 'Signup failed';
      
      // Handle specific Appwrite errors
      if (error.code === 409) {
        errorMessage = 'User with this email already exists';
      } else if (error.code === 400) {
        errorMessage = 'Invalid email or password format';
      } else if (error.code === 429) {
        errorMessage = 'Too many requests. Please try again in a few minutes';
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

  const isAuthenticated = user !== null

  console.log("isAuthenticated:", isAuthenticated)

  return (
    <AuthContext.Provider value={{
    user,
    isLoading,
    login,
    signup,
    isAuthenticated,
    router
  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};