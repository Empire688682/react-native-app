import { useAuthContext } from '@/lib/AuthContext'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import dayjs from 'dayjs' // Install with: npm install dayjs

// 🔁 This function checks how many days in a row the habit was completed (ending today)
function getCurrentStreak(completedDates = []) {
  const dateSet = new Set(
    completedDates.map(date => dayjs(date).format('YYYY-MM-DD'))
  )
  let streak = 0
  let today = dayjs().format('YYYY-MM-DD')

  while (dateSet.has(today)) {
    streak++
    today = dayjs(today).subtract(1, 'day').format('YYYY-MM-DD')
  }

  return streak
}

const streaks = () => {
  const { userHabits, getUserHabits } = useAuthContext();

  useFocusEffect(
    useCallback(() => {
      getUserHabits()
    }, [getUserHabits])
  );

  useEffect(() => {
    console.log("userHabits:", userHabits);
  }, [userHabits])

  // 🔄 Add streak and total completion to each habit
  const processedHabits = useMemo(() => {
    return userHabits.map(habit => ({
      ...habit,
      currentStreak: getCurrentStreak(habit.completedDates),
      totalCompleted: (habit.completedDates || []).length
    }))
  }, [userHabits])

  // 🥇 Get top 3 habits based on streak
  const topThree = useMemo(() => {
    return [...processedHabits]
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 3)
  }, [processedHabits])

  return (
    <View style={styles.content}>
      <Text style={styles.pageHeaderText}>
        Habit Streaks
      </Text>
      {
        userHabits.length < 1 ?
          <Text></Text>
          :
          <View>
            <View style={styles.headerContainer}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerIcon}>🥇</Text>
                <Text style={styles.headerText}>Top Streaks</Text>
              </View>
              <View style={styles.headerContent}>
                {
                  topThree.map((habit, idx) => (
                    <View key={habit._id} style={styles.headerCart}>
                      <View style={styles.cartLeft}>
                        <Text style={[styles.cartLeftRank, styles[`cartLeftRank${idx + 1}`]]}>{idx + 1}</Text>
                        <Text style={styles.cartText}>{habit.title}</Text>
                      </View>
                      <Text style={styles.cartRight}>{habit.currentStreak}</Text>
                    </View>
                  ))
                }
              </View>
            </View>

            {/* habits cart*/}
            <ScrollView
              style={styles.habitCartContainer}>
              {
                processedHabits.map((habit, idx) => (
                  <View key={habit._id} style={[styles.habitCart, styles[`habitCartTop${idx + 1}`]]}>
                    <View style={styles.cartHeader}>
                      <Text style={styles.cartTitle}>{habit.title}</Text>
                      <Text style={styles.cartDescription}>{habit.description}</Text>
                    </View>
                    <View style={styles.cartFooterRanks}>
                      <View style={styles.ranksBox}>
                        <Text style={styles.ranksIcon}>🔥 {habit.currentStreak}</Text>
                        <Text style={styles.ranksText}>Current</Text>
                      </View>
                      <View style={styles.ranksBox}>
                        <Text style={styles.ranksIcon}>🏆 {habit.streak || habit.currentStreak}</Text>
                        <Text style={styles.ranksText}>Best</Text>
                      </View>
                      <View style={styles.ranksBox}>
                        <Text style={styles.ranksIcon}>💯 {habit.totalCompleted}</Text>
                        <Text style={styles.ranksText}>Total</Text>
                      </View>
                    </View>
                  </View>
                ))
              }
            </ScrollView>

          </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  // 🔁 All your styles here — untouched
  content: {
    flex: 1,
    padding: 16,
    color: "black",
    backgroundColor: "#f0f0f0",
  },
  pageHeaderText: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 15
  },
  headerContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 9,
    marginBottom: 20
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: 15
  },
  headerIcon: {
    fontSize: 18
  },
  headerText: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
    color: "blue"
  },
  headerContent: {

  },
  headerCart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },
  cartLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },
  cartLeftRank: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: "white",
    borderRadius: 50
  },
  cartLeftRank1: {
    backgroundColor: "gold"
  },
  cartLeftRank2: {
    backgroundColor: "silver"
  },
  cartLeftRank3: {
    backgroundColor: "#D38E54"
  },
  cartText: {
    color: "black",
    fontWeight: 600
  },
  cartRight: {
    color: "black"
  },
  habitCartContainer: {
    padding: 10,
  },
  habitCart: {
    backgroundColor: "white",
    padding: 18,
    marginBottom: 15,
    borderRadius: 9
  },
  habitCartTop1: {
    borderColor: "green",
    borderWidth: 3
  },
  cartHeader: {
    paddingBottom: 20
  },
  cartTitle: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
    paddingBottom: 7
  },
  cartDescription: {
    color: "gray",
    paddingBottom: 10
  },
  cartFooterRanks: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ranksBox: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "silver",
    padding: 9
  },
  ranksIcon: {
    color: "white",
  },
  ranksText: {
    color: "black",
    fontSize: 12
  }
})

export default streaks
