import { useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StudentScreen } from "../screens/student";
import { Pressable, Text } from "react-native";
import { StudentProfile } from "../screens/student-profile";
import UserDrawer from "../components/user-drawer";
import { Home } from "../screens/home";

export type StackParamList = {
  Main: undefined;
  Student: { studentId: string, name: string, profilePicture: string | null };
  StudentProfile: { studentId: string };
};

const Stack = createNativeStackNavigator<StackParamList>();

export type DrawerParamList = {
  Home: undefined;
}

const Drawer = createDrawerNavigator<DrawerParamList>();

function Main() {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      initialRouteName="Home"
      drawerContent={(props) => <UserDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: '',
        }}
      />
    </Drawer.Navigator>
  )
}

export default function Navigation() {
  const { colors } = useTheme()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={Main}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
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

      <Stack.Screen
        name="StudentProfile"
        component={StudentProfile}
        options={{
          title: "Contact Info"
        }}
      />
    </Stack.Navigator>
  )
}
