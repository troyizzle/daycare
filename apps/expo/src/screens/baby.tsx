import React, { useState } from "react";
import { Modal, View, StyleSheet, Pressable, Image, TextInput } from "react-native";
import { trpc } from "../utils/trpc";
import SelectDropdown from 'react-native-select-dropdown'
import { FlashList } from "@shopify/flash-list";
import { Action, BabyActionLog } from ".prisma/client";
import { Icon, Text, ListItem, Card } from '@rneui/themed';
import ScreenWrapper from "../components/screen-wrapper";
import { useTheme } from "@react-navigation/native";

type BabyActionLogViewProps = {
  log: BabyActionLog & {
    action: Action
    teacher: {
      firstName: string
    }
  }
}

function formattedLogName(log: BabyActionLogViewProps['log']) {
  return `${log.action.name} at ${new Date(log.createdAt).toLocaleTimeString()}`
}

function BabyActionLogView({ log }: BabyActionLogViewProps) {
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
            {log.teacher.firstName}
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

type MoodFormProps = {
  babyId: string
}

function MoodForm({ babyId }: MoodFormProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const { colors } = useTheme()

  const utils = trpc.useContext();

  const { mutate } = trpc.baby.updateMood.useMutation({
    async onSuccess() {
      await utils.baby.byId.invalidate();
      setModalVisible(false);
    },
  })

  const [mood, setMood] = React.useState("");

  return (
    <>
      <Icon
        name="pencil"
        type="font-awesome"
        color={colors.primary}
        style={{
          alignItems: 'flex-end',
        }}
        onPress={() => {
          setModalVisible(true)
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ScreenWrapper>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Card>
              <Card.Title
                style={{
                  color: colors.text
                }}
              >How is the baby's mood?</Card.Title>
              <Card.Divider />
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <SelectDropdown
                  data={["Happy", "Sad", "Angry", "Tired", "Hungry"]}
                  onSelect={(selectedItem, index) => {
                    setMood(selectedItem)
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    return item
                  }}
                  buttonStyle={{
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    width: '80%',
                    height: 50,
                  }}
                  buttonTextStyle={{
                    color: colors.text,
                    fontSize: 18,
                  }}
                  dropdownStyle={{
                    backgroundColor: colors.background,
                    width: '80%',
                    height: 300,
                  }}
                  rowStyle={{
                    backgroundColor: colors.background,
                    borderBottomColor: colors.text,
                    borderBottomWidth: 1,
                  }}
                  rowTextStyle={{
                    color: colors.text,
                    fontSize: 18,
                  }}
                />
                <Pressable
                  style={{
                    marginTop: 20,
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    width: '80%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    mutate({
                      babyId,
                      mood: mood,
                    })
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 18,
                    }}
                  >Submit</Text>
                </Pressable>
              </View>
            </Card>
          </View>
        </ScreenWrapper>
      </Modal>
    </>
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
  const { mutate } = trpc.baby.createLog.useMutation({
    async onSuccess() {
      await utils.baby.byId.invalidate();
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
              babyId,
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

type BabyScreenProps = {
  route: any,
}

export function BabyScreen({ route }: BabyScreenProps) {
  const { colors } = useTheme()
  const [modalVisible, setModalVisible] = useState(false);
  const { babyId } = route.params;
  const babyQuery = trpc.baby.byId.useQuery({
    id: babyId,
  });

  return (
    <ScreenWrapper>
      {!babyQuery.data ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <View className="flex flex-row mt-2">
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                }}
                source={{
                  uri: 'https://www.clipartmax.com/png/middle/58-589113_infant-child-happiness-boy-icon-baby-boy-avatar.png',
                }}
              />
            </View>
            <View className="flex flex-col grow ml-6">
              <Text
                style={{
                  color: colors.text
                }}
                h1={true}>
                {babyQuery.data?.firstName} {babyQuery.data?.lastName}
              </Text>
              {babyQuery.data.mood && (
                <Text
                  style={{
                    color: colors.text,
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  Current mood: {babyQuery.data.mood}
                  <MoodForm babyId={babyQuery.data.id as string} />
                </Text>
              )}
            </View>
          </View >
          <FlashList
            data={babyQuery.data?.actionLogs ?? []}
            estimatedItemSize={100}
            ItemSeparatorComponent={() => <View className="border-t border-gray-500" style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <BabyActionLogView log={item} />
            )}
          />
          <NewActionForm babyId={babyId} modalVisible={modalVisible} setModalVisible={setModalVisible} />
          <AddActionButton setModalVisible={setModalVisible} />
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
