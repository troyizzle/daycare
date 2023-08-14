import { BottomSheet, Text } from "@rneui/themed"
import { SafeAreaView } from "react-native"

type EditProfileFormProps = {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
}

export default function EditProfileForm({ modalVisible, setModalVisible }: EditProfileFormProps) {
  return (
    <SafeAreaView>
      <BottomSheet
        isVisible={modalVisible}
      >
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
        <Text>Edit Profile</Text>
      </BottomSheet>
    </SafeAreaView>
  )
}
