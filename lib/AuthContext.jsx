import React, { useContext, createContext, useState, useEffect } from "react";
import { ID } from 'react-native-appwrite';
import { account } from "./appwrite";
import { useRouter } from "expo-router";

// Create context with default value
const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
   const router = useRouter();

  const isAuthenticated = user !== null

  console.log("isAuthenticated:", isAuthenticated)

  return (
    <AuthContext.Provider value={{
    user,
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