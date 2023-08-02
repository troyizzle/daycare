import { useUser } from '@clerk/clerk-expo';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UserDrawer from '../components/user-drawer';
import { HomeScreen } from '../screens/home';

type DrawerStackParamList = {
  Home: undefined;
}

const Drawer = createDrawerNavigator<DrawerStackParamList>();

export default function DrawerStack() {
  const { user } = useUser();

  if (!user) {
    throw new Error('User is not authenticated');
  }

  return (
    <Drawer.Navigator
      useLegacyImplementation
      initialRouteName="Home"
      drawerContent={props => <UserDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{
        headerTitle: '',
      }} />
    </Drawer.Navigator>
  )
}
