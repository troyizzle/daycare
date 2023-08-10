import { useTheme } from "@react-navigation/native";
import { Card, Text } from "@rneui/base";
import React from "react";
import { Modal, View, StyleSheet, TextInput, Pressable } from "react-native";
import { trpc } from "../../utils/trpc";
import SelectDropdown from "react-native-select-dropdown";
import ScreenWrapper from "../screen-wrapper";

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
      setIsSubmitting(false);
    },
  })

  const [actionId, setActionId] = React.useState("");
  const [text, setText] = React.useState("");

  function submitForm() {
    setIsSubmitting(true);
    mutate({
      studentId: babyId,
      actionId: actionId,
      notes: text,
    });
  }


  return (
    <ScreenWrapper>
      <Modal
        animationType="slide"
        transparent
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
                Cancel
              </Text>
            </Pressable>
            <Pressable
              disabled={!actionId || isSubmitting}
              onPress={submitForm}
              className="p-2 rounded-lg place-items-end bg-blue-500"
              style={{
                opacity: !actionId || isSubmitting ? 0.5 : 1
              }}
            >
              <Text
                h4={true}
                className="text-white"
                style={{
                  color: 'white'
                }}
              >{isSubmitting ? 'Submitting..' : 'Submit'}</Text>
            </Pressable>
          </View>
          <Card
            containerStyle={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <Card.Title
              h3
              style={{
                color: colors.text,
              }}
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
    </ScreenWrapper>
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
