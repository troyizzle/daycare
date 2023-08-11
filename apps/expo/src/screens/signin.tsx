import React from "react";
import { View, SafeAreaView, Text, Pressable, useColorScheme } from "react-native";
import LoginSVG from "../../assets/login.svg"
import InputField from "../components/input-field";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SigninStackParamList } from "../navigation/login";
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "@react-navigation/native";

type SignInProps = NativeStackScreenProps<SigninStackParamList, "Signin">

export function SignIn({ navigation }: SignInProps) {
  const scheme = useColorScheme();
  const { colors } = useTheme();
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
    <SafeAreaView>
      {scheme != "dark" && (
        <View className="items-center">
          <LoginSVG
            height={200}
            width={200}
            style={{
              transform: [{ rotate: "-5deg" }],
            }}
          />
        </View>
      )}

      <View className="h-full w-full p-3">
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: colors.text,
            marginBottom: 10
          }}
        >
          Login
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputField
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholder="Phone Number..."
              keyboardType="phone-pad"
            />
          )}
          name="phoneNumber"
        />
        <Pressable
          disabled={!formState.isValid || formState.isSubmitting}
          className="rounded p-3 mt-3"
          style={{
            backgroundColor: colors.primary,
            opacity: formState.isValid ? 1 : 0.5
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-center">
            {formState.isSubmitting ? "Submitting..." : "Get Code"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView >
  );
}
