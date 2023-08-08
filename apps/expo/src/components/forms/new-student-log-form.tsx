import { useTheme } from "@react-navigation/native";
import { Card, Text } from "@rneui/base";
import React from "react";
import { Modal, View, StyleSheet, TextInput, Pressable } from "react-native";
import { trpc } from "../../utils/trpc";
import SelectDropdown from "react-native-select-dropdown";

type NewActionFormProps = {
  babyId: string,
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void,
}

export default function NewStudentActionForm({ babyId, modalVisible, setModalVisible }: NewActionFormProps) {
  const { colors } = useTheme()

  const actionQuery = trpc.action.all.useQuery(undefined, {
    enabled: modalVisible,
  });

  const utils = trpc.useContext();
  const { mutate } = trpc.student.createLog.useMutation({
    async onSuccess() {
      await utils.student.logsByStudentId.invalidate();
      setModalVisible(false);
    },
  })

  const [actionId, setActionId] = React.useState("");
  const [text, setText] = React.useState("");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View
        className="h-full w-full"
        style={{
          ...styles.modalView,
          backgroundColor: colors.background
        }}>
        <View className="flex flex-row justify-between p-2">
          <Pressable
            className="p-2 rounded place-items-start disabled:opacity-75"
            onPress={() => setModalVisible(false)}
          >
            <Text h4={true}
              style={{
                color: colors.primary
              }}
            >
              Close
            </Text>
          </Pressable>
          <Pressable
            disabled={!actionId}
            onPress={() => mutate({
              studentId: babyId,
              actionId: actionId,
              notes: text,
            })}
            className="p-2 rounded place-items-end disabled:opacity-75"
          >
            <Text h4={true}
              style={{
                color: colors.text
              }}
            >Submit</Text>
          </Pressable>
        </View>
        <Card>
          <Card.Title
            h3={true}
          >What did you do?</Card.Title>
          <Card.Divider />
          <View className="flex flex-col gap-2 items-center">
            <SelectDropdown
              defaultButtonText="Select an action"
              buttonTextStyle={{
                color: colors.text,
                fontSize: 20,
                fontWeight: 'bold',
              }}
              buttonStyle={{
                backgroundColor: colors.background,
                borderRadius: 10,
                width: '100%',
                borderColor: colors.border,
                borderStyle: "solid",
                borderWidth: 1
              }}
              rowStyle={{
                backgroundColor: colors.background,
              }}
              rowTextStyle={{
                color: colors.text,
                fontSize: 20,
                fontWeight: 'bold',
              }}
              data={actionQuery.data?.map(action => ({ label: action.name, value: action.id })) ?? []}
              onSelect={(selectedItem) => {
                setActionId(selectedItem.value);
              }}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem.label
              }}
              rowTextForSelection={(item) => item.label}
            />
            <TextInput
              onChangeText={(text) => {
                setText(text)
              }}
              style={{
                height: 40,
                width: '100%',
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: colors.background,
                padding: 10,
                color: colors.text,
              }}
              placeholder="Notes"
            />
          </View>
        </Card>
      </View>
    </Modal >
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
