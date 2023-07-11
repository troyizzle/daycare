import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { trpc } from "../utils/trpc";
import ScreenWrapper from "../components/screen-wrapper";
import { Avatar, ListItem, Text } from "@rneui/themed";
import { useTheme } from "@react-navigation/native";

type BabyResponse = inferProcedureOutput<AppRouter["baby"]["all"]>[number];

type BabyViewProps = {
  baby: BabyResponse
}

function BabyView({ baby }: BabyViewProps) {
  const { colors } = useTheme()

  return (
    <ListItem
      containerStyle={{
        backgroundColor: colors.card
      }}
      bottomDivider>
      <Avatar
        rounded
        source={{ uri: 'https://picsum.photos/200' }} />
      <ListItem.Content>
        <ListItem.Title
        ><Text
          style={{
            color: colors.text
          }}
          h4={true}>{baby.firstName}</Text></ListItem.Title>
      </ListItem.Content>
    </ListItem>
  )
}

export const HomeScreen = ({ navigation }) => {
  const babyQuery = trpc.baby.all.useQuery();

  return (
    <ScreenWrapper>
      <View className="h-full w-full">
        <View className="flex flex-1">
          <FlashList
            data={babyQuery.data}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={(baby) => (
              <TouchableOpacity onPress={() => navigation.navigate('Baby', { babyId: baby.item.id, name: baby.item.firstName })}>
                <BabyView baby={baby.item} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};
