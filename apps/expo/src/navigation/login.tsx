import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTheme } from "@rneui/themed"
import { SignIn } from "../screens/signin"
import Verification from "../screens/verification"

export type SigninStackParamList = {
  Signin: undefined
  Verification: {
    phoneNumber: string
  }
}

const SigninStack = createNativeStackNavigator<SigninStackParamList>()

export default function SigninNavigation() {
  const { theme: { colors } } = useTheme()

  return (
    <SigninStack.Navigator>
      <SigninStack.Screen
        name="Signin"
        component={SignIn}
        options={{ headerShown: false }}
      />

      <SigninStack.Screen
        name="Verification"
        component={Verification}
        options={{
          title: "Verification",
          headerTintColor: colors.primary,
          headerStyle: {
            backgroundColor: "transparent"
          }
        }}
      />
    </SigninStack.Navigator>
  )
}
