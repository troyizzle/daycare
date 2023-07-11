import useThemeColors from "../hooks/useThemeColors"
import { Text } from "react-native"

type TextWithColorProps = {
  children: React.ReactNode,
  styles?: any
}

export default function TextWithColor({ children, styles }: TextWithColorProps) {
  const colors = useThemeColors()

  return (
    <Text style={{ ...styles, color: colors.text }}>
      {children}
    </Text>
  )
}
