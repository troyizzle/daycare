import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { useUser } from "@clerk/clerk-expo";
import { UserResource } from "@clerk/types";
import { FAB } from "@rneui/themed";

type AddActionButtonProps = {
  studentId: string
  setModalVisible: (visible: boolean) => void,
}

type User = NonNullable<UserResource>

export default function StudentAddActionButton({
  studentId,
  setModalVisible
}: AddActionButtonProps) {
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
      const hasStudent = userQuery.data.students.find(student => student.student.id == studentId);

      if (hasStudent) {
        setCanAddAction(true);
      }
    }
  }, [userQuery.data])

  if (!canAddAction) {
    return null;
  }

  return (
    <FAB
      placement="right"
      onPress={() => {
        setModalVisible(true);
      }}
      icon={{ name: 'plus', type: 'font-awesome' }}
    />
  )
}

