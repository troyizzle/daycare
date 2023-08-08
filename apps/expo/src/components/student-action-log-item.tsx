import { StudentLogsByStudentIdResponse } from "@acme/api/src/router/student";
import { useTheme } from "@react-navigation/native";
import { ListItem } from "@rneui/themed";
import { useState } from "react";

type StudentActionLogViewProps = {
  log: StudentLogsByStudentIdResponse[number]
}

function formattedLogName(log: StudentActionLogViewProps['log']) {
  return `${log.action.name} at ${new Date(log.createdAt).toLocaleTimeString()}`
}

export default function StudentActionLogItem({ log }: StudentActionLogViewProps) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme()

  return (
    <ListItem.Accordion
      noIcon={!log.notes}
      containerStyle={{
        backgroundColor: colors.background
      }}
      content={
        <ListItem.Content>
          <ListItem.Title
            style={{
              color: colors.text
            }}
          >{formattedLogName(log)}</ListItem.Title>
          <ListItem.Subtitle
            style={{
              color: colors.text
            }}
          >
            {log.teacher?.firstName}
          </ListItem.Subtitle>
        </ListItem.Content>
      }
      isExpanded={expanded}
      onPress={() => !log.notes ? null : setExpanded(!expanded)}
    >
      <ListItem
        containerStyle={{
          backgroundColor: colors.background
        }}
        bottomDivider>
        <ListItem.Content
          style={{
            color: colors.text
          }}
        >
          <ListItem.Title
            style={{
              color: colors.text
            }}
          >{log.notes}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </ListItem.Accordion>
  )
}
