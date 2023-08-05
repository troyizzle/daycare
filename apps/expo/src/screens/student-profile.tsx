import { useTheme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, View, Text, ScrollView } from "react-native";
import ContactInfoCard from "../components/contact-info-card";
import ScreenWrapper from "../components/screen-wrapper";
import { DefaultStackParamList } from "../contexts/StackProvider";
import { trpc } from "../utils/trpc";

type StudentProfileProps = NativeStackScreenProps<DefaultStackParamList, 'StudentProfile'>;

export function StudentProfile({ route }: StudentProfileProps) {
  const contactInfoQuery = trpc.contactInformation.allByStudentId.useQuery({
    studentId: route.params.studentId
  })

  return (
    <ScreenWrapper>
      <View className="p-4">
        {contactInfoQuery.isLoading &&
          <ActivityIndicator size="large" color={useTheme().colors.primary} />
        }

        <ScrollView>
          {contactInfoQuery.data?.map((contactInfo) => (
            <ContactInfoCard key={contactInfo.id} contactInfo={contactInfo} />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}
