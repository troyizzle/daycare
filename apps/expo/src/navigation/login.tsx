import { useTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
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
  const { colors } = useTheme()
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
          headerTintColor: colors.text,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </SigninStack.Navigator>
  )
}
