import React from "react";

import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { trpc } from "../utils/trpc";

type BabyResponse = inferProcedureOutput<AppRouter["baby"]["all"]>[number];

type BabyViewProps = {
  baby: BabyResponse
}

function BabyView({ baby }: BabyViewProps) {
  return (
    <View className="flex flex-row items-center p-2 gap-x-4">
      <View>
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
          }}
        />
      </View>
      <View className="flex flex-col flex-1">
        <Text className="text-2xl text-white">{baby.name}</Text>
        <Text className="text-white text-sm">Last action taken: </Text>
      </View>
    </View>
  )
}

export const HomeScreen = ({ navigation }) => {
  const babyQuery = trpc.baby.all.useQuery();

  return (
    <SafeAreaView className="bg-slate-800">
      <View className="h-full w-full">
        <View className="flex flex-1">
          <FlashList
            data={babyQuery.data}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={(baby) => (
              <TouchableOpacity onPress={() => navigation.navigate('Baby', { babyId: baby.item.id, name: baby.item.name})}>
                <BabyView baby={baby.item} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
