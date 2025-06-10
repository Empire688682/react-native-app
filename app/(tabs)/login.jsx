import {View, Text, StyleSheet} from "react-native";

const Login = () => {
  return (
    <View style={styles.Container}>
      <Text style={styles.Text}>
        Hello this is Login page
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    Text:{
        backgroundColor:"red",
        fontFamily:"cursive"
    },
     Container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  }
})

export default Login
