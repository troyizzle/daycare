import { useUser } from "@clerk/clerk-expo";
import { useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/home";
import { Avatar, Icon } from "@rneui/base";
import { StudentScreen } from "../screens/student";
import { UserResource } from "@clerk/types";

export type DefaultStackParamList = {
  Home: undefined;
  Student: { studentId: string, name: string };
};

const DefaultStack = createNativeStackNavigator<DefaultStackParamList>();

type User = NonNullable<UserResource>

export default function DefaultStackProvider() {
  const user =  useUser().user as User

  const { colors } = useTheme()

  return (<DefaultStack.Navigator initialRouteName="Home">
    <DefaultStack.Screen
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
          return (
            <Avatar
              rounded
              source={{ uri: user.profileImageUrl }}
            />
          )
        },
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
