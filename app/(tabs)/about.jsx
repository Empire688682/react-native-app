import {View, Text, StyleSheet} from "react-native";

const About = () => {
  return (
    <View style={styles.Container}>
      <Text style={styles.Text}>
        Hello this is About Section
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    Text:{
        backgroundColor:"yellow",
        padding:"12"
    },
    Container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  }
})

export default About
