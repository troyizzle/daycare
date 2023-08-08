import React, { useState } from "react";
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { trpc } from "../utils/trpc";
import ScreenWrapper from "../components/screen-wrapper";
import { Text, Tab, TabView } from "@rneui/themed";
import { useTheme } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { UserByIdResponse } from "@acme/api/src/router/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import StudentListItem from "../components/student-list-item";
import { Student } from ".prisma/client";
import { DefaultStackParamList } from "../contexts/StackProvider";

type ChildrenFlashListProps = {
  data: Student[]
  navigation: NativeStackScreenProps<DefaultStackParamList, 'Student'>['navigation']
}

function ChildrenFlashList({ data, navigation }: ChildrenFlashListProps) {
  return (
    <FlashList
      data={data}
      estimatedItemSize={20}
      ItemSeparatorComponent={() => <View className="h-2" />}
      renderItem={(student) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Student',
            {
              studentId: student.item.id,
              name: `${student.item.firstName} ${student.item.lastName}`,
              profilePicture: student.item.profilePicture
            })}>
          <StudentListItem student={student.item} />
        </TouchableOpacity>
      )}
    />
  )
}

type StudentDisplayProps = {
  user: UserByIdResponse
  navigation: NativeStackScreenProps<DefaultStackParamList, 'Student'>['navigation']
}

function StudentDisplay({ user, navigation }: StudentDisplayProps) {
  const [index, setIndex] = useState(0);

  if (!user) throw new Error("User is undefined");

  const hasChildrens = user.children?.length > 0;
  const hasStudents = user.students?.length > 0;

  if (hasChildrens && hasStudents) {
    return (
      <>
        <Tab
          value={index}
          onChange={setIndex}
          indicatorStyle={{ backgroundColor: 'white', height: 3 }}
          variant="primary"
        >
          <Tab.Item
            title="Students"
            titleStyle={{ fontSize: 12 }}
            icon={{ name: 'people', type: 'ionicon' }}
          />
          <Tab.Item
            title="Children"
            titleStyle={{ fontSize: 12 }}
            icon={{ name: 'person', type: 'ionicon' }}
          />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item >
            <View style={{
              height: 200,
              width: Dimensions.get("screen").width
            }}>
              <ChildrenFlashList data={user.students.map(s => s.student)} navigation={navigation} />
            </View>
          </TabView.Item>
          <TabView.Item>
            <View style={{
              height: 200,
              width: Dimensions.get("screen").width
            }}>

              <ChildrenFlashList data={user.children.map(c => c.student)} navigation={navigation} />
            </View>
          </TabView.Item>
        </TabView>
      </>
    )
  } else if (hasChildrens) {
    return (
      <View style={{
        height: 200,
        width: Dimensions.get("screen").width
      }}>
        <ChildrenFlashList data={user.children.map(c => c.student)} navigation={navigation} />
      </View>
    )
  } else if (hasStudents) {
    return (
      <ChildrenFlashList data={user.students.map(s => s.student)} navigation={navigation} />
    )
  } else {
    return (
      <View><Text className="text-sky-50">No students or children</Text></View>
    )
  }
}

type HomeScreenProps = NativeStackScreenProps<DefaultStackParamList, 'HomeScreen'>

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { user } = useUser();

  if (!user) {
    throw new Error("User is undefined");
  }

  const userQuery = trpc.user.byId.useQuery({
    id: user.id
  })

  return (
    <ScreenWrapper>
      <ScrollView
        className="h-full w-full"
        refreshControl={
          <RefreshControl
            refreshing={userQuery.isFetching}
            onRefresh={() => userQuery.refetch()}
          />
        }
      >
        {userQuery.isLoading && <View className="min-h-screen justify-center items-center">
          <ActivityIndicator size="large" color={useTheme().colors.primary} />
        </View>
        }

        {userQuery.error && <View className="min-h-screen justify-center items-center">
          <Text className="text-sky-50">Error</Text>
        </View>
        }

        {userQuery.data && <StudentDisplay user={userQuery.data} navigation={navigation} />}
      </ScrollView>
    </ScreenWrapper >
  );
};
