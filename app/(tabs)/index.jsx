// app/(tabs)/index.jsx
import React, { useCallback, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from "@/lib/AuthContext";

export default function HomeScreen() {
  const {
    setIsAuthenticated,
    getUserHabits,
    userHabits = [],      
  } = useAuthContext();

  /* ────────── nav & scroll setup ────────── */
  const { scrollTo } = useLocalSearchParams();  
  const router = useRouter();
  const scrollRef = useRef(null);

  /* Scroll when screen gains focus */
  useFocusEffect(
    useCallback(() => {
      if (scrollTo === "bottom") {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
          router.setParams({ scrollTo: undefined });
        });
      }
    }, [scrollTo, router])
  );

  /* Refresh habits whenever the screen is focused */
  useFocusEffect(
    useCallback(() => {
      getUserHabits();
    }, [getUserHabits])
  );

  /* Logout */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      setIsAuthenticated(false);
    } catch (err) {
      console.warn("Logout failed:", err);
    }
  };

  /* ───────────── render ───────────── */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Today's Habits</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <MaterialCommunityIcons name="logout" size={18} color="#fff" />
          <Text style={styles.logoutButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {userHabits.length === 0 ? (
        <Text style={styles.noHabitText}>Ouch! No habit found 🙃</Text>
      ) : (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {userHabits.map((habit) => (
            <View
              style={styles.card}
              key={habit._id ?? habit.title}
            >
              <Text style={styles.title}>{habit.title}</Text>
              <Text style={styles.description}>{habit.description}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.streak}>
                  <FontAwesome5 name="fire" size={18} color="coral" />
                  <Text style={styles.streakText}>
                    {habit.streak}‑day streak
                  </Text>
                </View>

                <Text style={styles.frequency}>{habit.frequency}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/* ───────────── styles ───────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "coral",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  noHabitText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
    color: "#444",
    fontFamily: "cursive",
  },
  card: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  description: { marginBottom: 12, color: "#555" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streak: { flexDirection: "row", alignItems: "center", gap: 4 },
  streakText: { color: "orange", fontWeight: "600" },
  frequency: {
    backgroundColor: "gray",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: "capitalize",
    overflow: "hidden",
  },
});
