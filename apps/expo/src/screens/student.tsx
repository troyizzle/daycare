import React, { useState } from "react";
import { Modal, View, StyleSheet, Pressable, TextInput, ActivityIndicator, Dimensions } from "react-native";
import { trpc } from "../utils/trpc";
import SelectDropdown from 'react-native-select-dropdown'
import { FlashList } from "@shopify/flash-list";
import { Icon, Text, ListItem, Card } from '@rneui/themed';
import ScreenWrapper from "../components/screen-wrapper";
import { useTheme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../_app";
import { Avatar } from "@rneui/base";
import DateTimePicker from '@react-native-community/datetimepicker';
import { StudentLogsByStudentIdResponse } from "@acme/api/src/router/student";
import { useUser } from "@clerk/clerk-expo";

type StudentActionLogViewProps = {
  log: StudentLogsByStudentIdResponse[number]
}

function formattedLogName(log: StudentActionLogViewProps['log']) {
  return `${log.action.name} at ${new Date(log.createdAt).toLocaleTimeString()}`
}

function StudentActionLogView({ log }: StudentActionLogViewProps) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme()

  return (
    <ListItem.Accordion
      noIcon={!log.notes}
      containerStyle={{
        backgroundColor: colors.background
      }}
      content={
        <ListItem.Content>
          <ListItem.Title
            style={{
              color: colors.text
            }}
          >{formattedLogName(log)}</ListItem.Title>
          <ListItem.Subtitle
            style={{
              color: colors.text
            }}
          >
            {log.teacher?.firstName}
          </ListItem.Subtitle>
        </ListItem.Content>
      }
      isExpanded={expanded}
      onPress={() => !log.notes ? null : setExpanded(!expanded)}
    >
      <ListItem
        containerStyle={{
          backgroundColor: colors.background
        }}
        bottomDivider>
        <ListItem.Content
          style={{
            color: colors.text
          }}
        >
          <ListItem.Title
            style={{
              color: colors.text
            }}
          >{log.notes}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </ListItem.Accordion>
  )
}

type AddActionButtonProps = {
  setModalVisible: (visible: boolean) => void,
}

function AddActionButton({
  setModalVisible
}: AddActionButtonProps) {
  const { colors } = useTheme()

  return (
    <View style={{
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: 35,
      right: 10
    }}>
      <Icon
        reverse
        onPress={() => {
          setModalVisible(true);
        }}
        raised
        name='heartbeat'
        type='font-awesome'
        color={colors.primary}
      />
    </View>
  )
}

type NewActionFormProps = {
  babyId: string,
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void,
}

function NewActionForm({ babyId, modalVisible, setModalVisible }: NewActionFormProps) {
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

type StudentScreenProps = NativeStackScreenProps<StackParamList, 'Student'>;

export function StudentScreen({ route }: StudentScreenProps) {
  const { user } = useUser()
  if (!user) throw new Error("User is not logged in")

  const { colors } = useTheme()

  const [modalVisible, setModalVisible] = useState(false);
  const [chosenDate, setChosenDate] = useState(new Date());
  const [canAddAction, setCanAddAction] = useState(false);

  const userQuery = trpc.user.byId.useQuery({
    id: user.id
  })

  if (userQuery.data) {
    const roles = userQuery.data.roles.map(role => role.role.name);

    if (roles.includes("admin")) {
      setCanAddAction(true);
      return
    }

    if (roles.includes("teacher")) {
      if (userQuery.data.students.find((s) => s.studentId === route.params.studentId)) {
        setCanAddAction(true);
        return
      }
    }
  }

  const { studentId } = route.params;

  const queryDate = new Date(
    chosenDate.getUTCFullYear(),
    chosenDate.getUTCMonth(),
    chosenDate.getUTCDate(),
  )

  const studentLogQuery = trpc.student.logsByStudentId.useQuery({
    studentId,
    date: new Date(queryDate.getTime())
  });

  return (
    <ScreenWrapper>
      <View className="flex flex-row mt-2">
        <Avatar
          rounded
          size="large"
          source={{ uri: 'https://picsum.photos/200' }}
        />
        <View className="flex flex-col grow ml-4">
          <Text
            style={{
              color: colors.text
            }}
            h1={true}>
            {route.params.name}
          </Text>
          <View
            className="flex flex-row items-center mt-2">
            <Text
              h4={true}
            >
              Viewing:
            </Text>
            <DateTimePicker
              mode="date"
              value={chosenDate}
              onChange={(_event, selectedDate) => {
                if (selectedDate) setChosenDate(selectedDate);
                studentLogQuery.refetch()

              }}
              themeVariant={useTheme().dark ? "dark" : "light"}
            />
          </View>
        </View>
      </View >
      {studentLogQuery.isLoading && <View className="mt-2"><ActivityIndicator color={colors.primary} size="large" /></View>}
      {studentLogQuery.data && (
        <>
          <FlashList
            data={studentLogQuery.data}
            estimatedItemSize={100}
            ItemSeparatorComponent={() => <View className="border-t border-gray-500" style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <View style={{
                width: Dimensions.get("screen").width
              }}>
                <StudentActionLogView log={item} />
              </View>
            )}
          />
          <NewActionForm babyId={studentId} modalVisible={modalVisible} setModalVisible={setModalVisible} />
          {canAddAction && <AddActionButton setModalVisible={setModalVisible} />}
        </>
      )}
    </ScreenWrapper >
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
