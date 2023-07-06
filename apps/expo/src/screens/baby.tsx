import React, { useState } from "react";
import { Modal, Text, View, StyleSheet, Pressable } from "react-native";
import { trpc } from "../utils/trpc";
import SelectDropdown from 'react-native-select-dropdown'
import { FlashList } from "@shopify/flash-list";

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
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>What did you do?</Text>
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
          <Pressable
            onPress={() => mutate({
              babyId,
              actionId: actionId,
            })}>
            <Text>Submit</Text>
          </Pressable>
        </View>
      </View>
    </Modal >
  )
}

type BabyScreenProps = {c
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
        <View><Text>Hey</Text></View>
        <View className="flex flex-row grow ml-4">
          <FlashList
            data={babyQuery.data?.actionLogs ?? []}
            estimatedItemSize={100}
            renderItem={({ item }) => (
              <View className="flex flex-row">
                <Text className="text-white">{item.action.name}</Text>
              </View>
            )}
          />
        </View>
      </View>
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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
