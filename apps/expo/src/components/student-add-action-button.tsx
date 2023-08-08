import { Icon } from "@rneui/base";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { trpc } from "../utils/trpc";
import { useUser } from "@clerk/clerk-expo";
import { UserResource } from "@clerk/types";
import { useTheme } from "@react-navigation/native";

type AddActionButtonProps = {
  studentId: string
  setModalVisible: (visible: boolean) => void,
}

type User = NonNullable<UserResource>

export default function StudentAddActionButton({
  studentId,
  setModalVisible
}: AddActionButtonProps) {
  const { colors } = useTheme();
  const user = useUser().user as User;
  const [canAddAction, setCanAddAction] = useState(false);

  const userQuery = trpc.user.byId.useQuery({
    id: user.id
  })

  useEffect(() => {
    if (!userQuery.data) return;
    const roles = userQuery.data.roles.map(role => role.role.name.toLowerCase());

    if (roles.includes("admin")) {
      setCanAddAction(true);
    }

    if (roles.includes("teacher")) {
      console.log(userQuery.data.students[0]?.student.id)
      console.log(studentId)
      const hasStudent = userQuery.data.students.find(student => student.student.id == studentId);
      console.log(hasStudent)
      if (hasStudent) {
        setCanAddAction(true);
      }
    }
  }, [userQuery.data])

  if (!canAddAction) {
    return null;
  }

  return (
    <View style={{
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

