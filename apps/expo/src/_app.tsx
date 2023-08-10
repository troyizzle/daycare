import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TRPCProvider } from "./utils/trpc";
import { SignInSignUpScreen } from "./screens/signin";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/cache";
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, DarkTheme } from "@react-navigation/native"
import PushNotificationProvider from "./contexts/PushNotificationProvider";
import { StatusBar, useColorScheme } from "react-native";
import Navigation from "./navigation";

export const App = () => {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ClerkProvider
        publishableKey="pk_test_d29uZHJvdXMtY293YmlyZC04LmNsZXJrLmFjY291bnRzLmRldiQ"
        tokenCache={tokenCache}
      >
        <SignedIn>
          <TRPCProvider>
            <PushNotificationProvider>
              <SafeAreaProvider>
                <DefaultStackProvider />
              </SafeAreaProvider>
            </PushNotificationProvider>
          </TRPCProvider>
        </SignedIn>
        <SignedOut>
          <SignInSignUpScreen />
        </SignedOut>
      </ClerkProvider>
      <StatusBar />
    </NavigationContainer >
  );
};
