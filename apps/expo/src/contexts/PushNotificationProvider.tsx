import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useEffect, createContext, useContext, useRef } from 'react';
import { trpc } from '../utils/trpc';

type PushNotificationContext = {}

const PushNotificationContext = createContext({} as PushNotificationContext);

export function usePushNotification() {
  return useContext(PushNotificationContext);
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'hello fannycita',
      data: { data: 'goes here' },
    },
    trigger: {
      seconds: 2,

    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

type PushNotificationProviderProps = {
  children: React.ReactNode
}

export default function PushNotificationProvider({ children }: PushNotificationProviderProps) {
  const notificationListener = useRef();
  const responseListener = useRef();

  const { mutate: createPushTokenMutate } = trpc.userPushToken.create.useMutation({
    onError: (error) => {
      console.log(error)
    }
  })

  useEffect(() => {
    const subscription = Notifications.addPushTokenListener(({ data: { token } }) => {
      createPushTokenMutate({ pushToken: token })
    });
    return () => subscription.remove();
  }, []);

  // useEffect(() => {
  //   // registerForPushNotificationsAsync().then(token => {
  //   //   if (token) createPushTokenMutate({ pushToken: token })
  //   // });
  //
  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  return (
    <PushNotificationContext.Provider value={{
    }}>
      {children}
    </PushNotificationContext.Provider>
  )
}
