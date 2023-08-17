import * as React from "react";
import { TRPCProvider } from "./utils/trpc";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { NavigationContainer } from '@react-navigation/native';
import PushNotificationProvider from "./contexts/PushNotificationProvider";
import Navigation from "./navigation";
import SigninNavigation from "./navigation/login";
import { createTheme, Text, ThemeProvider } from "@rneui/themed";
import Background from "./components/background";
import ColorSchemeProvider from "./contexts/color-scheme-provider";
import { StatusBar } from "react-native";
import { tokenCache } from "./utils/cache";
import Constants from "expo-constants";

export const App = () => {
  const theme = createTheme();

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <ColorSchemeProvider>
          <Background>
            <ClerkProvider
              publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
              tokenCache={tokenCache}
            >
              <SignedIn>
                <TRPCProvider>
                  <Navigation />
                </TRPCProvider>
              </SignedIn>
              <SignedOut>
                <SigninNavigation />
              </SignedOut>
            </ClerkProvider>
          </Background>
          <StatusBar />
        </ColorSchemeProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
};
