import { useTheme } from "@react-navigation/native"
import { TextInput, View } from "react-native"

type InputFieldProps = React.ComponentProps<typeof TextInput>

export default function InputField({ ...props }: InputFieldProps) {
  const { colors } = useTheme()

  return (
    <View
      className="flex p-4 rounded border shadow"
      style={{
        borderColor: colors.border,
      }}
    >
      <TextInput
        style={{
          color: colors.text,
        }}
        placeholderTextColor={colors.text}
        {...props}
      />
    </View>
  )
}
