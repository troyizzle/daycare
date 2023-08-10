import { useAuth, useUser } from "@clerk/clerk-expo";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import { Avatar } from "@rneui/themed";
import { Pressable, SafeAreaView, Text, View } from "react-native";

function SignOutButton() {
  const { isLoaded, signOut } = useAuth();
  const { colors } = useTheme();

  if (!isLoaded) {
    return null;
  }

  return (
    <View className="p-4">
      <Pressable
        style={{
          backgroundColor: colors.primary
        }}
        className="rounded-full p-4"
        onPress={() => {
          signOut();
        }}
      >
        <Text className="font-semibold text-center"
          style={{
            color: colors.text
          }}
        >
          Sign Out
        </Text>
      </Pressable>
    </View>
  )
}

export default function UserDrawer(_props: DrawerContentComponentProps) {
  const user = useUser().user!
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex flex-col gap-3 p-4 flex-grow">
        <View>
          <Avatar
            rounded
            source={{ uri: user.imageUrl }}
          />
        </View>
        <Text
          className="font-bold"
          style={{
            color: colors.text
          }}
        >
          {user.fullName}
        </Text>
      </View>
      <SignOutButton />
    </SafeAreaView>
  )
}
