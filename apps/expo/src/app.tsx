import * as React from "react";
import { TRPCProvider } from "./utils/trpc";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/cache";
import { NavigationContainer } from '@react-navigation/native';
import PushNotificationProvider from "./contexts/PushNotificationProvider";
import Navigation from "./navigation";
import SigninNavigation from "./navigation/login";
import { createTheme, Text, ThemeProvider } from "@rneui/themed";
import Background from "./components/background";
import ColorSchemeProvider from "./contexts/color-scheme-provider";
import { StatusBar } from "react-native";



export const App = () => {
  const theme = createTheme();

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <ColorSchemeProvider>
          <Text>Hello</Text>
          <StatusBar />
        </ColorSchemeProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
};
