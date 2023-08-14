import React, { useState } from "react";
import { View, ActivityIndicator, Dimensions, useColorScheme } from "react-native";
import { trpc } from "../utils/trpc";
import { FlashList } from "@shopify/flash-list";
import { Text } from '@rneui/themed';
import ScreenWrapper from "../components/screen-wrapper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Avatar } from "@rneui/base";
import DateTimePicker from '@react-native-community/datetimepicker';
import NewStudentActionForm from "../components/forms/new-student-log-form";
import StudentActionLogItem from "../components/student-action-log-item";
import StudentAddActionButton from "../components/student-add-action-button";
import { StackParamList } from "../navigation";

type StudentScreenProps = NativeStackScreenProps<StackParamList, 'Student'>

export function StudentScreen({ route }: StudentScreenProps) {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [chosenDate, setChosenDate] = useState(new Date());

  const { studentId } = route.params;

  const studentLogQuery = trpc.student.logsByStudentId.useQuery({
    studentId,
    date: new Date(chosenDate.getTime() - (chosenDate.getTimezoneOffset() ?? 0) * 60000)
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
            h1
          >
            {route.params.name}
          </Text>
          <View
            className="flex flex-row items-center mt-2">
            <DateTimePicker
              mode="date"
              value={chosenDate}
              timeZoneOffsetInSeconds={3600}
              onChange={(_event, selectedDate) => {
                if (selectedDate) {
                  setChosenDate(selectedDate);
                  studentLogQuery.refetch()
                }
              }}
              themeVariant={colorScheme == 'dark' ? 'dark' : 'light'}
            />
          </View>
        </View>
      </View>

      {studentLogQuery.isLoading && (
        <View className="mt-2"><ActivityIndicator size="large" /></View>
      )}

      {studentLogQuery.data && (
        <View className="h-full">
          <FlashList
            data={studentLogQuery.data}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View className="border-t" />}
            renderItem={({ item }) => (
              <View
                style={{
                  width: Dimensions.get("screen").width
                }}>
                <StudentActionLogItem log={item} />
              </View>
            )}
          />
        </View>
      )}
      {modalVisible && <NewStudentActionForm babyId={studentId} modalVisible={modalVisible} setModalVisible={setModalVisible} />}
      <StudentAddActionButton setModalVisible={setModalVisible} studentId={route.params.studentId} />
    </ScreenWrapper >
  )
}
