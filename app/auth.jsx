import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";
import { Button, Text, TextInput, Snackbar } from "react-native-paper";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/lib/AuthContext";

const AuthScreenGuide = ({ children }) => {
  const { login, isAuthenticated, router } = useAuthContext();
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showToast = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAuth = () => {
    if (!email || !password) {
      showToast("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      showToast("Password must at least longer than 7 character");
      return;
    }

    // Add your authentication logic here
    setEmail("");
    setPassword("");
    showToast(isSignUp ? "Account created successfully!" : "Welcome back!");
  }

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
            <TextInput
              label="Email"
              style={styles.input}
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              mode="outlined"
            />
            <TextInput
              label="Password"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry={true}
              mode="outlined"
            />
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleAuth}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Button
              style={styles.switchModeButton}
              mode="text"
              onPress={handleSwitchMode}
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </Button>
          </View>
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: "green"
  },
  switchModeButton: {
    marginTop: 16,
  },
});

export default AuthScreen;