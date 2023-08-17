import React from "react";
import { View } from "react-native";
import ManComputerSVG from "../../assets/man-computer.svg"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SigninStackParamList } from "../navigation/login";
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import ScreenWrapper from "../components/screen-wrapper";
import { Button, Input, Text } from "@rneui/themed";
import SignInWithOAuth from "../components/oauth";

type SignInProps = NativeStackScreenProps<SigninStackParamList, "Signin">

export function SignIn({ navigation }: SignInProps) {
  const phoneNumberSchema = z.object({
    phoneNumber: z.string().min(10).max(10).regex(/^\d+$/)
  })

  type PhoneNumberInput = z.infer<typeof phoneNumberSchema>

  const { control, formState, handleSubmit } = useForm<PhoneNumberInput>({
    resolver: zodResolver(phoneNumberSchema)
  });

  function onSubmit(data: PhoneNumberInput) {
    navigation.navigate("Verification", {
      phoneNumber: data.phoneNumber
    })
  }

  return (
    <ScreenWrapper>
      <View className="flex items-center">
        <ManComputerSVG
          height={200}
          width={200}
        />
      </View>

      <View className="h-full w-full p-3">
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            marginBottom: 10
          }}
        >
          Login
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholder="Phone Number..."
              keyboardType="phone-pad"
            />
          )}
          name="phoneNumber"
        />
        <Button
          color="primary"
          disabled={!formState.isValid || formState.isSubmitting}
          onPress={handleSubmit(onSubmit)}
          title={formState.isSubmitting ? "Submitting..." : "Get Code"}
        />
        <SignInWithOAuth />
      </View>
    </ScreenWrapper>
  );
}
