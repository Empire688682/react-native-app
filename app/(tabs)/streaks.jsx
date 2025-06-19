import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

const streaks = () => {
  return (
    <View style={styles.content}>
      <Text style={styles.pageHeaderText}>
        Habit Streaks
      </Text>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerIcon}>🥇</Text>
          <Text style={styles.headerText}>Top Streaks</Text>
        </View>
        <View style={styles.headerContent}>
          {
            Array.from({ length: 3 }).map((_, idx) => (
              <View key={idx} style={styles.headerCart}>
                <View style={styles.cartLeft}>
                  <Text style={[styles.cartLeftRank, styles[`cartLeftRank${idx + 1}`]]}>{idx + 1}</Text>
                  <Text style={styles.cartText}>Meditate</Text>
                </View>
                <Text style={styles.cartRight}>1</Text>
              </View>
            ))
          }
        </View>
      </View>
      {/* habits cart*/}
      <ScrollView 
      style={styles.habitCartContainer}
      showsVerticalScrollIndicator={false}>
        {
          Array.from({ length: 3 }).map((_, idx) => (
            <View key={idx} style={[styles.habitCart, styles[`habitCartTop${idx+1}`]]}>
              <View style={styles.cartHeader}>
                <Text style={styles.cartTitle}>Meditate</Text>
                <Text style={styles.cartDescription}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem voluptatem nobis eveniet molestiae adipisci quis esse, dolore pariatur numquam saepe quod tempore?</Text>
              </View>
              <View style={styles.cartFooterRanks}>
                <View style={styles.ranksBox}>
                  <Text style={styles.ranksIcon}>🔥 0</Text>
                  <Text style={styles.ranksText}>Current</Text>
                </View>
                <View style={styles.ranksBox}>
                  <Text style={styles.ranksIcon}>🏆 0</Text>
                  <Text style={styles.ranksText}>Best</Text>
                </View>
                <View style={styles.ranksBox}>
                  <Text style={styles.ranksIcon}>💯 6</Text>
                  <Text style={styles.ranksText}>Total</Text>
                </View>
              </View>
            </View>
          ))
        }
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
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
    marginBottom:20
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
  habitCartContainer:{
    padding:10
  },
  habitCart:{
    backgroundColor:"white",
    padding:18,
    marginBottom:15,
    borderRadius:9
  },
  habitCartTop1:{
    borderColor:"green",
    borderWidth:3
  },
  cartHeader:{
    paddingBottom:20
  },
  cartTitle:{
    color:"black",
    fontWeight:"600",
    fontSize:16,
    paddingBottom:7
  },
  cartDescription:{
    color:"gray",
    paddingBottom:10
  },
  cartFooterRanks:{
    flexDirection:"row",
    justifyContent:"space-between",
  },
  ranksBox:{
    flexDirection:"column",
    alignItems:"center",
    borderRadius:6,
    backgroundColor:"silver",
    padding:9
  },
  ranksIcon:{
    color:"white",
  }
})

export default streaks
