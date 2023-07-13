import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TRPCProvider } from "./utils/trpc";
import { HomeScreen } from "./screens/home";
import { SignInSignUpScreen } from "./screens/signin";
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/cache";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { Image, useColorScheme } from "react-native";
import { DefaultTheme, DarkTheme } from "@react-navigation/native"
import { Icon } from "@rneui/base";
import { StudentScreen } from "./screens/student";

const Stack = createNativeStackNavigator();

export const App = () => {
  const scheme = useColorScheme();
  const { colors } = useTheme()

  return (
    <NavigationContainer theme={scheme == 'dark' ? DarkTheme : DefaultTheme}>
      <ClerkProvider
        publishableKey="pk_test_d29uZHJvdXMtY293YmlyZC04LmNsZXJrLmFjY291bnRzLmRldiQ"
        tokenCache={tokenCache}
      >
        <SignedIn>
          <TRPCProvider>
            <SafeAreaProvider>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    headerStyle: {
                      backgroundColor: colors.background
                    },
                    headerTintColor: colors.background,
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    headerTitle: '',
                    headerLeft: () => {
                      return <Icon
                        name='menu'
                        color={colors.text}
                        size={32}
                        onPress={() => console.log('pressed')}
                      />
                    },
                    headerRight: () => {
                      const { user } = useUser();

                      return (
                        <Image
                          source={{ uri: user?.profileImageUrl }}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 100,
                          }}
                        />
                      )
                    },
                  }}
                />
                <Stack.Screen
                  name="Student"
                  component={StudentScreen}
                  options={({ route }) => ({
                    title: route?.params?.name ?? 'Baby',
                    headerStyle: {
                      backgroundColor: colors.background,
                    },
                    headerRight: () => {
                      return <Icon
                        name='menu'
                        color={colors.text}
                        size={32}
                        onPress={() => console.log('pressed')}
                      />
                    },

                    headerTintColor: colors.text,
                    headerTitleStyle: {
                      fontWeight: 'bold',
                      color: colors.text
                    }
                  })}
                />
              </Stack.Navigator>
            </SafeAreaProvider>
          </TRPCProvider>
        </SignedIn>
        <SignedOut>
          <SignInSignUpScreen />
        </SignedOut>
      </ClerkProvider>
    </NavigationContainer >
  );
};
