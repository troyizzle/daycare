import { Student } from ".prisma/client"
import { Avatar, ListItem, Text } from "@rneui/themed"

type StudentListItemProps = {
  student: Student
}

export default function StudentListItem({ student }: StudentListItemProps) {
  return (
    <ListItem
      bottomDivider>
      <Avatar
        rounded
        source={{ uri: student.profilePicture ?? 'https://picsum.photos/200' }} />
      <ListItem.Content>
        <ListItem.Title>
          <Text>{student.firstName} {student.lastName}</Text>
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  )
}
