import { Image, ImageSourcePropType, TouchableOpacity } from "react-native";

type ScreenHeaderBtnProps = {
  iconUrl: ImageSourcePropType,
  dimension: string,
  handlePress: () => void,
}

export default function ScreenHeaderBtn({ iconUrl, dimension, handlePress }: ScreenHeaderBtnProps) {
  return (
    <TouchableOpacity style={{
      width: dimension,
      height: dimension,
      borderRadius: 100,
    }}
    onPress={handlePress}
    >
      <Image
        source={iconUrl}
        resizeMode='cover'
        style={{
        }}
      />
    </TouchableOpacity>
  )
}
