import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/clerk-expo";
import { tokenCache } from "../cache";
import * as Fonts from "expo-font";
import "../../global.css";
import { fonts } from "../utils/fonts";
import { AppProvider } from "../components/providers/app-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  console.log("publishableKey", publishableKey);

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  useEffect(() => {
    async function prepare() {
      try {
        // Remove the loading simulation
        await Fonts.loadAsync(fonts);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <ActivityIndicator className="flex-1 items-center justify-center bg-white" />
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoading>
        <ActivityIndicator className="flex-1 items-center justify-center bg-white" />
      </ClerkLoading>
      <ClerkLoaded>
        <AppProvider>
          <Stack />
        </AppProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
