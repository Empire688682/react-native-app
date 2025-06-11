import { Stack, useRouter } from "expo-router";
import { useEffect, ReactNode } from "react";

interface LayoutGuideProps {
  children: ReactNode;
}

const LayoutGuide = ({ children }: LayoutGuideProps) => {
  const isAuth = false;
  const router = useRouter()

  useEffect(() => {
    // Add a small delay to ensure the navigation stack is mounted
    const timer = setTimeout(() => {
      if (!isAuth) {
        router.replace("/auth");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuth, router]);

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <LayoutGuide>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{title:"Authentication"}} />
      </Stack>
    </LayoutGuide>
  );
}