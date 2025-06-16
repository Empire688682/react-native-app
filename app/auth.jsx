import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";
import { Button, Text, TextInput, Snackbar } from "react-native-paper";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/lib/AuthContext";
import axios from "axios";

const AuthScreenGuide = ({ children }) => {
  const { isAuthenticated, router } = useAuthContext();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [])

  return <>{children}</>
}

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Optimized signup function
  const signup = async () => {
    if (!email || !password || !name) {
      showToast("All field are required");
      return;
    }
    const userData = {
      name:name,
      email:email,
      password:password
    }
    try {
      setIsLoading(true);
      const response = await axios.post(process.env.EXPO_PUBLIC_API_URL + "users", userData);
      console.log("response:", response);
    } catch (error) {
      console.log("SigupError:", error);
      showToast(error.response.data.error);
    }
    finally{
      setIsLoading(false)
    }
  };

  // Login function with better error handling
  const login = async () => {
      if (!email || !password) {
      showToast("All field are required");
      return;
    }
    try {
      setIsLoading(true);
    } catch (error) {
      console.log("SigupError:", error)
    }
    finally{
      setIsLoading(false)
    }
  };

  const handleAuth = () => {
    if(isSignUp){
      signup();
      return;
    }
    else{
      login();
      return;
    }
  }

  const showToast = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSwitchMode = () => {
    setEmail("");
    setPassword("");
    setIsSignUp((prev) => !prev);
  }

  return (
    <AuthScreenGuide>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.title} variant="headlineMedium">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Text>

          <View>
            {
              isSignUp && (
                <TextInput
                  label="Name"
                  style={styles.input}
                  placeholder="Your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                />
              )
            }
            <TextInput
              label="Email"
              style={styles.input}
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"

            />
            <TextInput
              label="Password"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry={true}
            />
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleAuth}
              textColor="white"
            >
              {
                isLoading? "Processing...." 
                : 
                <>
                {isSignUp ? "Sign Up" : "Sign In"}
                </>
              }
            </Button>
            <Text
              style={styles.switchModeButton}
              mode="text"
              onPress={handleSwitchMode}
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </Text>
          </View>
        </View>

        <Snackbar
          style={styles.snack}
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          theme={{
            colors: "coral"
          }}
          action={{
            label: 'Dismiss',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    </AuthScreenGuide>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color:"black"
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor:"green",
  },
  switchModeButton: {
    marginTop: 16,
    color:"black",
    textAlign: "center"
  },
  snack: {
    backgroundColor:"red",
    color: "white"
  }
});

export default AuthScreen;