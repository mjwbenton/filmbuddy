import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
} from "@expo-google-fonts/jost";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useDbReady } from "@/db";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
  });
  const { success: dbReady, error: dbError } = useDbReady();

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  if (dbError) {
    throw dbError;
  }

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="roll/add" options={{ presentation: "modal" }} />
        <Stack.Screen name="roll/[id]" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="gear/camera/add"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="gear/camera/[id]"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="gear/lens/add"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="gear/lens/[id]"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="gear/film-stock/add"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="gear/film-stock/[id]"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
