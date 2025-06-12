import { AuthProvider, useAuthContext } from "@/lib/AuthContext";
import { Stack} from "expo-router";
import { useEffect } from "react";

const LayoutGuide = ({ children }) => {
  const {isAuthenticated, router} = useAuthContext();

  useEffect(() => {
    // Add a small delay to ensure the navigation stack is mounted
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace("/auth");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutGuide>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ title: "Authentication" }} />
        </Stack>
      </LayoutGuide>
    </AuthProvider>
  );
}