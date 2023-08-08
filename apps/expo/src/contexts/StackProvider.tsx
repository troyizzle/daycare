import { useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StudentScreen } from "../screens/student";
import DrawerStack from "../navigation/drawer";
import { Pressable, Text } from "react-native";
import { StudentProfile } from "../screens/student-profile";

export type DefaultStackParamList = {
  HomeScreen: undefined;
  Student: { studentId: string, name: string, profilePicture: string | null };
  StudentProfile: { studentId: string };
};

const DefaultStack = createNativeStackNavigator<DefaultStackParamList>();

export default function DefaultStackProvider() {
  const { colors } = useTheme()

  return (<DefaultStack.Navigator>
    <DefaultStack.Screen
      name="HomeScreen"
      component={DrawerStack}
      options={{
        headerShown: false
      }}
    />

    <DefaultStack.Screen
      name="Student"
      component={StudentScreen}
      options={({ navigation, route }) => ({
        headerTitle: () => (
          <Pressable onPress={() => navigation.navigate("StudentProfile", {
            studentId: route.params.studentId
          })}>
            <Text style={{ color: colors.primary }}>{route.params.name}</Text>
          </Pressable>
        ),
      })}
    />

    <DefaultStack.Screen
      name="StudentProfile"
      component={StudentProfile}
      options={{
        title: "Contact Info"
      }}
    />
  </DefaultStack.Navigator>
  )
}
