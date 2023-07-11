import { Image, ImageSourcePropType, TouchableOpacity } from "react-native";
import { COLORS, SIZES } from "../constants";
import { StyleSheet } from "react-native";

type ScreenHeaderBtnProps = {
  iconUrl: ImageSourcePropType,
  dimension: string,
  handlePress: () => void,
}

export default function ScreenHeaderBtn({ iconUrl, dimension, handlePress }: ScreenHeaderBtnProps) {
  return (
    <TouchableOpacity style={styles(dimension).btnContainer} onPress={handlePress}>
      <Image
        source={iconUrl}
        resizeMode='cover'
        style={styles(dimension).btnImg}
      />
    </TouchableOpacity>
  )
}


const styles = (dimension: string) => StyleSheet.create({
  btnContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
  },
  btnImg: {
    width: dimension,
    height: dimension,
    borderRadius: SIZES.small / 1.25,
    color: COLORS.white,
  },
});
