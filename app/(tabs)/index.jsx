import { useAuthContext } from "@/lib/AuthContext";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEffect, useState } from "react";

export default function Index() {
  const {
     setIsAuthenticated,
     getUserHabits,
     userHabits
     } = useAuthContext();

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userData']);
      setIsAuthenticated(false);
    } catch (err) {
      console.warn('Logout failed', err);
    }
  };

  useEffect(()=>{
   getUserHabits()
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Today's Habits</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButtonContainer}>
          <MaterialCommunityIcons name="logout" size={20} color="white" style={styles.logoutButton} />
          Sign out
        </TouchableOpacity>
      </View>
      {
        userHabits.length < 1? 
        <Text style={styles.noHabit}>"Ouch No habit found!</Text>
        :
        <ScrollView >
        {
        userHabits.map((data, id) => (
          <View style={styles.contentContainer} key={id}>
            <Text style={styles.title}>
              {data.title}
            </Text>
            <Text style={styles.description}>
              {data.description}
            </Text>
            <View style={styles.footer}>
              <View style={styles.streak}>
                <FontAwesome5 name="fire" size={20} color="coral" />
                <Text>{data.streak} days streaks</Text>
              </View>
              <Text style={styles.frequency}>
                {data.frequency}
              </Text>
            </View>
          </View>
        ))
      }
      </ScrollView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom:15
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  logoutButtonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "coral",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    color: "white"
  },
  noHabit:{
    textAlign:"center",
    fontFamily:"cursev",
    fontSize:18,
    padding:10,
    marginTop:25
  },
  contentContainer: {
    marginTop: 25,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    paddingBottom: 10
  },
  description: {
    paddingBottom: 20
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10
  },
  streak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  frequency: {
    backgroundColor: "gray",
    color: "white",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    textTransform: "capitalize"
  }
});