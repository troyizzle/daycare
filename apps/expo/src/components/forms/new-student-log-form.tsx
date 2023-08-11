import { useTheme } from "@react-navigation/native";
import { Card, Text } from "@rneui/base";
import React from "react";
import { Modal, View, StyleSheet, TextInput } from "react-native";
import { trpc } from "../../utils/trpc";
import SelectDropdown from "react-native-select-dropdown";
import ScreenWrapper from "../screen-wrapper";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentNewLogSchema, type StudentNewLogInput } from "../../../../../packages/db/schema/student";
import { Button, Icon, ListItem } from "@rneui/themed";
import InputField from "../input-field";

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

  const { control, formState, handleSubmit, getValues, setValue } = useForm<StudentNewLogInput>({
    resolver: zodResolver(studentNewLogSchema),
    defaultValues: {
      studentId: babyId,
    }
  })

  const utils = trpc.useContext();

  const { mutate } = trpc.student.createLog.useMutation({
    async onSuccess() {
      await utils.student.logsByStudentId.invalidate();
      setModalVisible(false);
    },
  })

  function submitForm(data: StudentNewLogInput) {
    mutate(data)
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
            backgroundColor: colors.background,
          }}>
          <View className="flex flex-row justify-between p-2">
            <Button
              color="primary"
              type="clear"
              radius="sm"
              onPress={() => setModalVisible(false)}
            >
              <Text h4={true}
                style={{
                  color: colors.primary
                }}
              >
                Cancel
              </Text>
            </Button>
            <Button
              disabled={!formState.isValid || formState.isSubmitting}
              color="primary"
              onPress={handleSubmit(submitForm)}
              radius="md"
            >
              <Text
                h4={true}
                className="text-white"
                style={{
                  color: 'white'
                }}
              >{formState.isSubmitting ? 'Submitting..' : 'Submit'}</Text>
            </Button>
          </View>
          <Card
            containerStyle={{
              borderColor: colors.border,
            }}
          >
            <Card.Title
              h3
              style={{
                color: colors.text,
              }}
            >
              What did you do?
            </Card.Title>
            <Card.Divider />
            <View className="flex flex-col gap-2 items-center">
              <View
                className="w-full h-24"
              >
                <Controller
                  control={control}
                  name="notes"
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      placeholder="Please feel free to add any notes here."
                      multiline
                      style={{
                        height: '100%',
                      }}
                    />
                  )}
                />
              </View>

              {actionQuery.data?.map(action => (
                <ListItem key={action.id}
                  containerStyle={{
                    width: '100%',
                  }}
                  bottomDivider
                  onPress={() => {
                    setValue("actionId", action.id, {
                      shouldTouch: true,
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                >
                  <ListItem.Content>
                    <ListItem.Title
                      style={{
                        color: colors.text,
                      }}
                      selectionColor={colors.primary}
                    >
                      {action.name}
                    </ListItem.Title>
                  </ListItem.Content>
                  {getValues('actionId') == action.id && (
                    <Icon name="check" color={colors.primary} />
                  )}
                </ListItem>
              ))}
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
    marginTop: 40,
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
