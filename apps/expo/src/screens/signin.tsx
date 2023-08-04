import React, { useState } from "react";
import { View, SafeAreaView, Text, Pressable } from "react-native";
import SignInWithOAuth from "../components/SignInWithOAuth";
import LoginSVG from "../../assets/login.svg"
import InputField from "../components/input-field";

export const SignInSignUpScreen = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: ""
  });

  return (
    <SafeAreaView>
      <View className="items-center">
        <LoginSVG
          height={200}
          width={200}
          style={{
            transform: [{ rotate: "-5deg" }],
          }}
        />
      </View>

      <View className="h-full w-full p-3">
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 10
          }}
        >
          Login
        </Text>
        <InputField
          value={formState.email}
          onChangeText={(text) => setFormState({ ...formState, email: text })}
          placeholder="Email"
          keyboardType="email-address"
        />
        <View className="mt-3">
          <InputField
            value={formState.password}
            onChangeText={(text) => setFormState({ ...formState, password: text })}
            placeholder="Password"
            secureTextEntry
          />
        </View>
        <Pressable
          className="rounded p-3 mt-3 bg-blue-500"
        >
          <Text className="text-white text-center">Login</Text>
        </Pressable>

        <Text className="text-center my-3">or</Text>
        <SignInWithOAuth />
      </View>
    </SafeAreaView >
  );
};
