import { Student } from ".prisma/client"
import { useTheme } from "@react-navigation/native"
import { Avatar, ListItem, Text } from "@rneui/themed"

type StudentListItemProps = {
  student: Student
}

export default function StudentListItem({ student }: StudentListItemProps) {
  const { colors } = useTheme();

  return (
    <ListItem
      containerStyle={{
        backgroundColor:  colors.card
      }}
      bottomDivider>
      <Avatar
        rounded
        source={{ uri: student.profilePicture ?? 'https://picsum.photos/200' }} />
      <ListItem.Content>
        <ListItem.Title>
          <Text
            style={{
              color: colors.text
            }}
          >{student.firstName} {student.lastName}</Text>
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  )
}
