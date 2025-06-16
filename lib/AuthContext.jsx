import React, { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create context with default value
const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
   const router = useRouter();

   useEffect(()=>{
    const loadUserData = async () =>{
      const userData = await AsyncStorage.getItem("userData");
      if(userData){
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setIsAuthenticated(true);
      }
    }
    loadUserData();
   }, []);

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