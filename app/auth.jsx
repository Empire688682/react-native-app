import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";
import { Button, Text, TextInput, Snackbar } from "react-native-paper";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/lib/AuthContext";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthScreenGuide = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter()
  useEffect(() => {
    if (isAuthenticated) {
        router.replace("/(tabs)");
      }
  }, [isAuthenticated]);

  return <>{children}</>
}

const AuthScreen = () => {
  const {refresh} = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //create new user
  const signup = async () => {
    if (!email || !password || !name) {
      showToast("All fields are required");
      return;
    }

    const newUser = {
      name,
      email,
      password,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        process.env.EXPO_PUBLIC_API_URL + "auth/signup",
        newUser
      );

      const { token, user } = response.data;

      // Save to AsyncStorage
      const userDataToSave = JSON.stringify({
        token: token,
        username: user.name,
        email: user.email, // fixed typo: was "eamil"
      });

      await AsyncStorage.setItem("userData", userDataToSave);

      setName("");
      setPassword("");
      setEmail("");
      await refresh();

    } catch (error) {
      console.log("SignupError:", error?.response?.data || error.message);
      showToast(error?.response?.data?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

//login user
  const signin = async () => {
    if (!email || !password) {
      showToast("All fields are required");
      return;
    }

    const existingUser = {
      email,
      password,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        process.env.EXPO_PUBLIC_API_URL + "auth/signin",
        existingUser
      );

      console.log("response:", response)

      const { token, user } = response.data;

      // Save to AsyncStorage
      const userDataToSave = JSON.stringify({
        token: token,
        username: user.name,
        id: user.id,
        email: user.email, // fixed typo: was "eamil"
      });

      await AsyncStorage.setItem("userData", userDataToSave);

      setPassword("");
      setEmail("");
      await refresh();

    } catch (error) {
      console.log("SignupError:", error?.response?.data || error.message);
      showToast(error?.response?.data?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = () => {
    if (isSignUp) {
      signup();
      return;
    }
    else {
      signin();
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
                isLoading ? "Processing...."
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
    color: "black"
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: "green",
  },
  switchModeButton: {
    marginTop: 16,
    color: "black",
    textAlign: "center"
  },
  snack: {
    backgroundColor: "red",
    color: "white"
  }
});

export default AuthScreen;