import { useAuth, useUser } from "@clerk/clerk-expo";
import { Pressable, SafeAreaView, Text, View } from "react-native";

function SignOutButton() {
  const { isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <Pressable
      className="bg-gray-300 rounded-full p-4"
      onPress={() => {
        signOut();
      }}
    >
      <View className="flex items-center">
        <Text className="font-bold">
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
