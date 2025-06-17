import { useAuthContext } from "@/lib/AuthContext";
import { 
  Text, 
  View, 
  StyleSheet,
  TouchableOpacity, 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
const {user, setIsAuthenticated} = useAuthContext();

const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['userData']);
    setIsAuthenticated(false);               
  } catch (err) {
    console.warn('Logout failed', err);
  }
};

  return (
    <View style={styles.container}>
      <Text>Wlecome back {user?.username}!</Text>
      <TouchableOpacity onPress={logout} style={{backgroundColor:"red", marginTop:20, padding:5}}>
        Logout
      </TouchableOpacity>
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