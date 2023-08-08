import React, { useState } from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";
import { trpc } from "../utils/trpc";
import { FlashList } from "@shopify/flash-list";
import { Text } from '@rneui/themed';
import ScreenWrapper from "../components/screen-wrapper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Avatar } from "@rneui/base";
import DateTimePicker from '@react-native-community/datetimepicker';
import { DefaultStackParamList } from "../contexts/StackProvider";
import { useTheme } from "@react-navigation/native";
import NewStudentActionForm from "../components/forms/new-student-log-form";
import StudentActionLogItem from "../components/student-action-log-item";
import StudentAddActionButton from "../components/student-add-action-button";

type StudentScreenProps = NativeStackScreenProps<DefaultStackParamList, 'Student'>

export function StudentScreen({ route }: StudentScreenProps) {
  const { colors } = useTheme()

  const [modalVisible, setModalVisible] = useState(false);
  const [chosenDate, setChosenDate] = useState(new Date());

  const { studentId } = route.params;

  const studentLogQuery = trpc.student.logsByStudentId.useQuery({
    studentId,
    date: chosenDate
  });

  return (
    <ScreenWrapper>
      <View className="flex flex-row mt-2 p-1">
        <Avatar
          rounded
          size="large"
          source={{ uri: route.params.profilePicture ?? 'https://picsum.photos/200' }}
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
                <StudentActionLogItem log={item} />
              </View>
            )}
          />
          <NewStudentActionForm babyId={studentId} modalVisible={modalVisible} setModalVisible={setModalVisible} />
          <StudentAddActionButton setModalVisible={setModalVisible} studentId={route.params.studentId} />
        </>
      )}
    </ScreenWrapper >
  )
}
