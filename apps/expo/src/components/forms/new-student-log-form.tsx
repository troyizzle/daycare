import React from "react";
import { Alert, Modal, View } from "react-native";
import { trpc } from "../../utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentNewLogSchema, type StudentNewLogInput } from "../../../../../packages/db/schema/student";
import { Button, Icon, ListItem, useTheme, Card, Input } from "@rneui/themed";

type NewActionFormProps = {
  babyId: string,
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void,
}

export default function NewStudentActionForm({ babyId, modalVisible, setModalVisible }: NewActionFormProps) {
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
    onError(error) {
      Alert.alert('Error', error.message);
    }
  })

  function submitForm(data: StudentNewLogInput) {
    mutate(data)
  }

  const { theme: { colors } } = useTheme();

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      presentationStyle="formSheet"
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View
        className="h-full"
        style={{
          backgroundColor: colors.background,
        }}>
        <View className="flex flex-row justify-between p-2">
          <Button
            color="primary"
            type="clear"
            onPress={() => setModalVisible(false)}
            title="Cancel"
          />
          <Button
            disabled={!formState.isValid || formState.isSubmitting}
            color="primary"
            onPress={handleSubmit(submitForm)}
            radius="md"
            loading={formState.isSubmitting}
            title="Submit"
          />
        </View>
        <Card>
          <Card.Title h3>
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
                  <Input
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

            {actionQuery.data?.map((action, index) => (
              <ListItem key={action.id}
                containerStyle={{
                  width: '100%',
                }}
                bottomDivider={index !== actionQuery.data.length - 1}
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
                  >
                    {action.name}
                  </ListItem.Title>
                </ListItem.Content>
                {getValues('actionId') == action.id && (
                  <Icon name="check" />
                )}
              </ListItem>
            ))}
          </View>
        </Card>
      </View>
    </Modal >
  )
}
