import { BottomSheet, Text } from "@rneui/themed";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

type EditThemeSheetProps = {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
}

export default function EditThemeSheet({ modalVisible, setModalVisible }: EditThemeSheetProps) {
  return (
    <SafeAreaProvider>
      <BottomSheet
        backdropStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
        modalProps={{
        }}
        isVisible={modalVisible}
      >
        <View className="bg-red-500">
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
          <Text>Edit Theme</Text>
        </View>
      </BottomSheet>
    </SafeAreaProvider>
  )
}
