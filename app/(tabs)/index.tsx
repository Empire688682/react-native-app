import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.welcomeText}>Welcome!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"red"
  },
  welcomeText: {
    color: "white",
    padding: 26, 
  },
});