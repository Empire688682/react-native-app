import React, { useContext, createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

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

   const refresh = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  };

  console.log("isAuthenticated:", isAuthenticated)

  return (
    <AuthContext.Provider value={{
    user,
    isAuthenticated,
    router,
    refresh
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