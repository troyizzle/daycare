import React from "react";
import { TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { trpc } from "../utils/trpc";
import ScreenWrapper from "../components/screen-wrapper";
import { Avatar, ListItem, Text, Icon } from "@rneui/themed";
import { useTheme } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { Student } from ".prisma/client";

type StudentViewProps = {
  student: Student
}

function StudentView({ student }: StudentViewProps) {
  const { colors } = useTheme()

  return (
    <ListItem
      containerStyle={{
        backgroundColor: colors.card
      }}
      bottomDivider>
      <Avatar
        rounded
        source={{ uri: 'https://picsum.photos/200' }} />
      <ListItem.Content>
        <ListItem.Title
        ><Text
          style={{
            color: colors.text
          }}
          h4={true}>{student.firstName}</Text></ListItem.Title>
      </ListItem.Content>
    </ListItem>
  )
}

type ChildrenFlashListProps = {
  data: any
  navigation: any
}

function ChildrenFlashList({ data, navigation }: ChildrenFlashListProps) {
  if (!data) return null;

  return (<FlashList
    data={data}
    estimatedItemSize={20}
    ItemSeparatorComponent={() => <View className="h-2" />}
    renderItem={(student: any) => (
      <TouchableOpacity onPress={() => navigation.navigate('Student',
        { studentId: student.item.id, name: student.item.firstName })}>
        <StudentView student={student.item} />
      </TouchableOpacity>
    )}
  />
  )
}

export const HomeScreen = ({ navigation }) => {
  const { user } = useUser();

  if (!user) return null; // This shouldn't happen

  const userQuery = trpc.user.byId.useQuery({
    id: user.id
  })

  return (
    <ScreenWrapper>
      <View className="h-full w-full">
        <View className="flex flex-1">
          {userQuery.isLoading && <Icon name="spinner" type="font-awesome" />}
          {userQuery?.data?.children?.length > 0 && (
            <>
              <View className="flex items-center my-2">
                <Text h3={true}>Your children</Text>
              </View>
              <ChildrenFlashList data={userQuery.data.children.map((p) => p.student)} navigation={navigation} />
            </>
          )}
          {userQuery?.data?.students?.length > 0 && (
            <>
              <View className="flex items-center my-2">
                <Text h3={true}>Your students</Text>
              </View>
              <ChildrenFlashList data={userQuery.data.students.map(s => s.student)} navigation={navigation} />
            </>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};
