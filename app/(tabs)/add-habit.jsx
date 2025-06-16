import { 
  Text, 
  View, 
  StyleSheet, 
} from "react-native";

export default function AddHabit() {

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#f8f9fa',
  },
});