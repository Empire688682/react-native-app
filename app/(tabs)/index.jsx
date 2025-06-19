import React, { useCallback, useRef } from "react";
import {
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
import { SwipeListView } from "react-native-swipe-list-view";
import { useAuthContext } from "@/lib/AuthContext";
import { format, isSameDay } from 'date-fns';

export default function HomeScreen() {
  const {
    setIsAuthenticated,
    getUserHabits,
    userHabits = [],
    deleteHabit,
    completeHabit,
    user
  } = useAuthContext();

  console.log(userHabits)

  const router = useRouter();

  /* ------------------------------------------------------------------ */
  /*  Auto‑scroll to bottom when the screen receives  ?scrollTo=bottom  */
  /* ------------------------------------------------------------------ */
  const listRef = useRef(null);
  const { scrollTo } = useLocalSearchParams();

useFocusEffect(
  useCallback(() => {
    if (scrollTo === "bottom") {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd?.({ animated: true }); 
        router.setParams({ scrollTo: undefined });
      });
    }
  }, [scrollTo, router])
);

  /* ----------------------------------------------------- */
  /*  Refresh habits each time the tab/screen gains focus  */
  /* ----------------------------------------------------- */
  useFocusEffect(
    useCallback(() => {
      getUserHabits();
    }, [getUserHabits])
  );

  /* -------------------- Logout ------------------------- */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      setIsAuthenticated(false);
    } catch (err) {
      console.warn("Logout failed:", err);
    }
  };

  /* ---------------- Handlers for swipe actions --------- */
  const onDelete = async (id) => {
    await deleteHabit(id);
    getUserHabits();
  };

  const onComplete = async (id) => {
    await completeHabit(id);
    getUserHabits();
  };

  const today = new Date();

  /* ---------------------------- render ---------------------------- */
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
        <SwipeListView
          ref={listRef}
          data={userHabits}
          keyExtractor={(item) => item._id ?? item.title}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          /* visible row -------------------------------------------------- */
          ListHeaderComponent={
            <Text>Start your day {`${user?.username}`}💪 {format(today, 'MMM dd, yyyy')}</Text>
          }
          ListFooterComponent={<Text>For you're a champion 💪</Text>}
          renderItem={({ item }) => (
            <View style={[
              styles.card,
              item.lastCompleted && isSameDay(new Date(item.lastCompleted), today) && styles.cardCompleted
            ]}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.streak}>
                  <FontAwesome5 name="fire" size={18} color="coral" />
                  <Text style={styles.streakText}>
                    {item.streak}‑day streak
                  </Text>
                </View>

                <Text style={styles.frequency}>{item.frequency}</Text>
              </View>
            </View>
          )}
          /* hidden row (swipe actions) ----------------------------------- */
          renderHiddenItem={({ item }) => (
            <View style={styles.hiddenButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "green" }]}
                onPress={() => onComplete(item._id)}
              >
                {
                  // Check if lastCompleted is today using date comparison
                  item.lastCompleted && isSameDay(new Date(item.lastCompleted), today) ? 
                    <Text style={{ color: '#fff', fontSize: 12 }}>Completed</Text>
                    :
                    <FontAwesome5 name="check" size={18} color="#fff" />
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "red" }]}
                onPress={() => onDelete(item._id)}
              >
                <FontAwesome5 name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-70}
        />
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
  /* header */
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
  logoutButtonText: { color: "#fff", fontWeight: "600" },
  /* empty state */
  noHabitText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
    color: "#444",
    fontFamily: "cursive",
  },
  /* card */
  card: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom:18
  },
    cardCompleted: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#e8f5e8",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
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
  },
  /* swipe buttons */
  hiddenButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
    marginTop: 20,
    marginBottom: 18
  },
  actionButton: {
    width: 70,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginLeft: 10,
  },
});