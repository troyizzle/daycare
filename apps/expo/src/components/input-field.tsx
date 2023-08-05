import { TextInput, View } from "react-native"

type InputFieldProps = React.ComponentProps<typeof TextInput>

export default function InputField({ ...props }: InputFieldProps) {
  return (
    <View
      className="flex p-4 rounded border border-gray-300 shadow"
    >
      <TextInput
        {...props}
      />
    </View>
  )
}
