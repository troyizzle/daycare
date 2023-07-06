import React, { useState } from "react";
import { Modal, Text, View, StyleSheet, Pressable, Image } from "react-native";
import { trpc } from "../utils/trpc";
import SelectDropdown from 'react-native-select-dropdown'
import { FlashList } from "@shopify/flash-list";
import { Action, BabyActionLog } from ".prisma/client";

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
  return (
    <View className="py-2">
      <View>
        <Text className="text-white text-2xl ">
          {formattedLogName(log)}
        </Text>
        <Text className="text-white">
          {log.teacher.firstName}
        </Text>
      </View>
    </View>
  )
}

type AddActionButtonProps = {
  setModalVisible: (visible: boolean) => void,
}

function AddActionButton({
  setModalVisible
}: AddActionButtonProps) {
  return (
    <View style={{
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: 35,
      right: 10,
    }}>
      <Pressable style={{
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={{
          fontSize: 30,
          fontWeight: 'bold',
        }}>+</Text>
      </Pressable>
    </View>
  )
}

type NewActionFormProps = {
  babyId: string,
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void,
}

function NewActionForm({ babyId, modalVisible, setModalVisible }: NewActionFormProps) {
  const actionQuery = trpc.action.all.useQuery(undefined, {
    enabled: modalVisible,
  });

  const utils = trpc.useContext();
  const { mutate } = trpc.baby.createLog.useMutation({
    async onSuccess() {
      await utils.baby.all.invalidate();
      setModalVisible(false);
    },
  })

  const [actionId, setActionId] = React.useState("");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View className="h-full w-full bg-slate-800 p-4" style={styles.modalView}>
        <View className="flex flex-row items-center justify-between">
          <Pressable
            className="bg-red-500 p-2 rounded place-items-start"
            onPress={() => setModalVisible(false)}
          >
            <Text className="font-bold text-lg text-white">Close</Text>
          </Pressable>
          <Pressable
            onPress={() => mutate({
              babyId,
              actionId: actionId,
            })}
            className="bg-green-500 p-2 rounded place-items-end"
          >
            <Text className="font-bold text-lg text-white">Submit</Text>
          </Pressable>
        </View>
        <View className="flex flex-col gap-2 mt-10 items-center">
          <Text className="text-white">What did you do?</Text>
          <SelectDropdown
            data={actionQuery.data?.map(action => ({ label: action.name, value: action.id })) ?? []}
            onSelect={(selectedItem) => {
              setActionId(selectedItem.value);
            }}
            buttonTextAfterSelection={(selectedItem) => {
              return selectedItem.label
            }}
            rowTextForSelection={(item) => item.label}
          />
        </View>
      </View>
    </Modal >
  )
}

type BabyScreenProps = {
  route: any,
}

export function BabyScreen({ route }: BabyScreenProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { babyId } = route.params;
  const babyQuery = trpc.baby.byId.useQuery({
    id: babyId,
  });

  return (
    <View
      className="bg-slate-800 p-2"
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <View className="flex flex-row">
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
        <View className="flex flex-row grow ml-4">
        </View>
      </View>
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
    </View >
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
