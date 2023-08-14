import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StudentScreen } from "../screens/student";
import { StudentProfile } from "../screens/student-profile";
import UserDrawer from "../components/user-drawer";
import { Home } from "../screens/home";
import { Button, useTheme } from "@rneui/themed";

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
  const { theme: { colors } } = useTheme()

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
          headerStyle: {
            backgroundColor: colors.background
          }
        }}
      />
    </Drawer.Navigator>
  )
}

export default function Navigation() {
  const { theme: { colors } } = useTheme()

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
          headerStyle: {
            backgroundColor: colors.background
          },
          headerTitle: () => (
            <Button
              type="clear"
              onPress={() => navigation.navigate("StudentProfile", {
                studentId: route.params.studentId
              })}
              title={route.params.name}
            />
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
