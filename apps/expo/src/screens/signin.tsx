import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, Pressable } from "react-native";
import SignInWithOAuth from "../components/SignInWithOAuth";
import LoginSVG from "../../assets/login.svg"
import InputField from "../components/input-field";
import { useSignIn } from "@clerk/clerk-expo";

export const SignInSignUpScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState<string>("");
  const { signIn, setActive, isLoaded } = useSignIn();

  useEffect(() => {
    if (code.length != 6 || !isLoaded) {
      return
    }

    async function login() {
      if (!signIn) return

      const { createdSessionId } = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      })

      if (createdSessionId) {
        await setActive({
          session: createdSessionId,
        })
      }
    }

    login()
  }, [code])

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
        {codeSent ? (
          <InputField
            value={code}
            onChangeText={(text) => setCode(text)}
            placeholder="Verification Code..."
            keyboardType="number-pad"
          />
        ) : (
          <>
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
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              placeholder="Phone Number..."
              keyboardType="phone-pad"
            />
            <Pressable
              className="rounded p-3 mt-3 bg-blue-500"
              onPress={async () => {
                if (!isLoaded) return

                const { supportedFirstFactors } = await signIn.create({
                  identifier: `+1${phoneNumber}`,
                })

                const firstPhoneFactor = supportedFirstFactors.find(factor => {
                  return factor.strategy === 'phone_code'
                });

                if (!firstPhoneFactor) {
                  throw new Error("No phone factor found")
                }

                const { phoneNumberId } = firstPhoneFactor;

                await signIn.prepareFirstFactor({
                  strategy: "phone_code",
                  phoneNumberId,
                })

                setCodeSent(true)
              }}
            >
              <Text className="text-white text-center">Get Code</Text>
            </Pressable>

            <Text className="text-center my-3">or</Text>
            <SignInWithOAuth />
          </>
        )}
      </View>
    </SafeAreaView >
  );
};
