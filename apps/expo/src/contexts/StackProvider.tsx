import { useUser } from "@clerk/clerk-expo";
import { useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/home";
import { Avatar, Icon } from "@rneui/base";
import { StudentScreen } from "../screens/student";
import { UserResource } from "@clerk/types";
import DrawerStack from "../navigation/drawer";

export type DefaultStackParamList = {
  Home: undefined;
  Student: { studentId: string, name: string };
};

const DefaultStack = createNativeStackNavigator<DefaultStackParamList>();

type User = NonNullable<UserResource>

export default function DefaultStackProvider() {
  const user =  useUser().user as User

  const { colors } = useTheme()

  return (<DefaultStack.Navigator>
    <DefaultStack.Screen
      name="Test"
      component={DrawerStack}
      options={{
        headerShown: false
      }}
    />

    <DefaultStack.Screen
      name="Student"
      component={StudentScreen}
      options={({ route }) => ({
        title: route.params.name,
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
  </DefaultStack.Navigator>
  )
}
