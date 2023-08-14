import { useAuth, useUser } from "@clerk/clerk-expo";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Avatar, ListItem, useTheme, Text, Button, Icon } from "@rneui/themed";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import EditThemeSheet from "./edit-theme-sheet";

function SignOutButton() {
  const { isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <View className="p-4">
      <Button
        color="secondary"
        radius="xl"
        onPress={() => {
          signOut();
        }}
        title="Sign Out"
      />
    </View>
  )
}

function ThemeToggleButton({ setIsEditTheme }: { setIsEditTheme: (isEditTheme: boolean) => void }) {
  return (
    <Icon
      onPress={() => {
        setIsEditTheme(true)
      }}
      raised name="moon-o" type="font-awesome" />
  )
}

export default function UserDrawer(_props: DrawerContentComponentProps) {
  const user = useUser().user!
  const { theme: { colors } } = useTheme();

  const [isEditTheme, setIsEditTheme] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="flex flex-col gap-3 p-4 flex-grow">
        <View>
          <Avatar
            rounded
            source={{ uri: user.imageUrl }}
          />
        </View>
        <Text h4>
          {user.fullName}
        </Text>

        <ListItem onPress={() => {
          console.log("viewable true")
        }}>
          <ListItem.Title>Edit Profile</ListItem.Title>
        </ListItem>
      </View>
      <ThemeToggleButton setIsEditTheme={setIsEditTheme} />
      <EditThemeSheet modalVisible={isEditTheme} setModalVisible={setIsEditTheme} />
      <SignOutButton />
    </SafeAreaView>
  )
}
