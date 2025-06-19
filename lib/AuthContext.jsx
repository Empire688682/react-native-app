import React, { useContext, createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

// Create context with default value
const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userHabits, setUserHabits] = useState([]);
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
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

    const getUserHabits = async() =>{
      try {
        const response = await axios.get(
          process.env.EXPO_PUBLIC_API_URL + `habit/user-habits/${user.id}`
        );
  
        if(response.status === 201){
          if(response.data.length < 1){
            setUserHabits([]);
          }
          else{
            setUserHabits(response.data);
          }
          return;
        }
      } catch (error) {
        console.log("getUserHabitsError:", error)
      };
    };

    const deleteHabit = async(habitId) =>{
      try {
        const data = {
          userId:user.id,
          habitId:habitId
        }
       await axios.post(process.env.EXPO_PUBLIC_API_URL + `habit/delete`, data);
      } catch (error) {
        console.log("error:", error)
      }
    }; 

    const completeHabit = async(habitId) =>{
      try {
        const data = {
          userId:user.id,
          habitId:habitId
        }
       const response = await axios.post(process.env.EXPO_PUBLIC_API_URL + `habit/complete`, data);
       console.log("completeHabit:", response)
      } catch (error) {
        console.log("error:", error)
      }
    };  

  return (
    <AuthContext.Provider value={{
    user,
    router,
    isAuthenticated,
    setIsAuthenticated,
    refresh,
    getUserHabits,
    setUserHabits,
    userHabits,
    deleteHabit,       
    completeHabit,
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