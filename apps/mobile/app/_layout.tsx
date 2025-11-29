import { Stack } from "expo-router";
import {
  useFonts,
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
} from "@expo-google-fonts/jost";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useDbReady } from "../db";
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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
