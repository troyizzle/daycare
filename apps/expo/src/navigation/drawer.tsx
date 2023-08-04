import { useUser } from '@clerk/clerk-expo';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import { Icon } from '@rneui/themed';
import UserDrawer from '../components/user-drawer';
import { HomeScreen } from '../screens/home';

const Drawer = createDrawerNavigator();

export type DrawerStackProps = DrawerScreenProps<DrawerStack>

export default function DrawerStack() {
  const { user } = useUser();

  if (!user) {
    throw new Error('User is not authenticated');
  }

  return (
    <Drawer.Navigator
      drawerContent={props => <UserDrawer {...props} user={user} />}
      initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen}
      options={{
        drawerIcon: ({ focused, size }) => (
          <Icon name="home" size={size} color={focused ? 'primary' : 'muted'} />
        ),
      }}
      />
    </Drawer.Navigator>
  )
}
