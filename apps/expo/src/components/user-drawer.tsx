import { useAuth, useUser } from "@clerk/clerk-expo";
import { Icon } from "@rneui/base";
import { Pressable, SafeAreaView, Text, View } from "react-native";

function SignOutButton() {
  const { isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <Pressable
      className="bg-blue-500 rounded p-4"
      onPress={() => {
        signOut();
      }}
    >
      <View className="flex items-center">
        <Text className="text-white font-bold">
        <Icon name="sign-out" type="font-awesome" size={20} />
          Sign Out
        </Text>
      </View>
    </Pressable>
  )
}

export default function UserDrawer() {
  const { user } = useUser();

  if (!user) {
    return null
  }

  return (
    <SafeAreaView className="h-full flex flex-col">
      <View className="flex-grow">
        <Text className="text-center font-bold">{user.fullName}</Text>
      </View>
      <View className="p-4">
        <SignOutButton />
      </View>
    </SafeAreaView>
  )
}
