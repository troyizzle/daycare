import { useTheme } from "@react-navigation/native"
import { SafeAreaView, View } from "react-native"

type ScreenWrapperProps = {
  children: React.ReactNode
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  const { colors } = useTheme()

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: colors.background,
          height: "100%",
        }}>
        {children}
      </View>
    </SafeAreaView>
  )
}
