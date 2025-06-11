import {KeyboardAvoidingView, Platform, View, StyleSheet} from "react-native";
import {Button, Text, TextInput, Snackbar} from "react-native-paper";
import { useState } from "react";
import { useAuthContext } from "@/lib/AuthContext";

const AuthScreen = () => {
  const {login, signup, isLoading} = useAuthContext(); // Added isLoading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showToast = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAuth = async () => {
    if(!email || !password){
      showToast("Please fill in all fields");
      return;
    }

    if(password.length < 8){
      showToast("Password must be at least 8 characters long");
      return;
    }
    
    try {
      let result;
      
      if (isSignUp) {
        // Sign up logic
        result = await signup(email, password);
      } else {
        // Sign in logic
        result = await login(email, password);
      }
      
      console.log("Auth result:", result);
      
      if (result.success) {
        // Clear form on success
        setEmail("");
        setPassword("");
        showToast(result.message);
        // Navigation will be handled by your layout component
      } else {
        // Show error message
        showToast(result.message);
      }
    } catch (error) {
      console.error("Auth error:", error);
      showToast("An unexpected error occurred. Please try again.");
    }
  }

  const handleSwitchMode = () => {
    setEmail("");
    setPassword("");
    setIsSignUp((prev) => !prev);
  }

  return (
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
            disabled={isLoading} // Disable when loading
          />
          <TextInput 
            label="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none" 
            secureTextEntry={true}
            mode="outlined"
            disabled={isLoading} // Disable when loading
          />
          <Button 
            style={styles.button} 
            mode="contained" 
            onPress={handleAuth}
            loading={isLoading} // Show loading spinner
            disabled={isLoading} // Disable when loading
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button 
            style={styles.switchModeButton} 
            mode="text" 
            onPress={handleSwitchMode}
            disabled={isLoading} // Disable when loading
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
    fontWeight: 'bold',
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