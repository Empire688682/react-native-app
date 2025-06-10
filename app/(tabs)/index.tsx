import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Link href="/login">Login</Link>
      <Link href="/about">About</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    color: "yellow",
    backgroundColor: "black",
    padding: 26, 
  },
});