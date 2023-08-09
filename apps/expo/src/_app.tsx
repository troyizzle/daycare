import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TRPCProvider } from "./utils/trpc";
import { SignInSignUpScreen } from "./screens/signin";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/cache";
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { DefaultTheme, DarkTheme } from "@react-navigation/native"
import DefaultStackProvider from "./contexts/StackProvider";
import PushNotificationProvider from "./contexts/PushNotificationProvider";

export const App = () => {
  const { dark } = useTheme()

  return (
    <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
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
    </NavigationContainer >
  );
};
