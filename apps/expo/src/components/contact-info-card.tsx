import { ContactInformation } from ".prisma/client"
import { useTheme } from "@react-navigation/native"
import { Card } from "@rneui/base"
import { CardTitle } from "@rneui/base/dist/Card/Card.Title"
import { Icon } from "@rneui/themed"
import { View, Text, Linking, Pressable } from "react-native"

type ContactInfoCardProps = {
  contactInfo: ContactInformation
}

export default function ContactInfoCard({ contactInfo }: ContactInfoCardProps) {
  const { colors } = useTheme();
  return (
    <View>
      <Card containerStyle={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}>
        <CardTitle h4>
          {contactInfo.firstName} {contactInfo.lastName}
        </CardTitle>
        <Text
          className="text-gray-500 text-center font-bold mb-4"
        >{contactInfo.relationship}</Text>
        <Text
          className="text-gray-500 text-center font-bold mb-4"
        >{contactInfo.phone}</Text>
        <Card.Divider />
        <View className="flex flex-row items-center justify-between">
          <Pressable
            onPress={() => { Linking.openURL(`tel:${contactInfo.phone}`) }}
            className="rounded p-4 bg-gray-300"
          >
            <Icon name="phone" size={24} />
          </Pressable>

          <Pressable
            onPress={() => { Linking.openURL(`mailto:${contactInfo.email}`) }}
            className="rounded p-4 bg-gray-300"
          >
            <Icon name="mail" size={24} />
          </Pressable>

          <Pressable
            onPress={() => { Linking.openURL(`sms:${contactInfo.phone}`) }}
            className="rounded p-4 bg-gray-300"
          >
            <Icon name="message" size={24} />
          </Pressable>
        </View>
      </Card>
    </View >
  )
}
