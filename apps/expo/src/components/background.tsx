import { makeStyles } from "@rneui/themed";
import { SafeAreaView } from "react-native";

type BackgroundProps = {
  children: React.ReactNode;
};

export default function Background({ children }: BackgroundProps) {
  const styles = useStyles();
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    height: "100%",
  },
}));
