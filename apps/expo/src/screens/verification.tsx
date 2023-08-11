import { useState } from "react"
import { useSignIn } from "@clerk/clerk-expo"
import { useTheme } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Button, Text } from "@rneui/themed"
import { useEffect }   from "react"
import { View } from "react-native"
import InputField from "../components/input-field"
import ScreenWrapper from "../components/screen-wrapper"
import { SigninStackParamList } from "../navigation/login"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

type VerificationProps = NativeStackScreenProps<SigninStackParamList, "Verification">

export default function Verification({ route }: VerificationProps) {
  const [nextCodeSendTimer, setNextCodeSendTimer] = useState(0)
  const [isSendingCode, setIsSendingCode] = useState(false)

  const { colors } = useTheme()
  const { isLoaded, signIn, setActive } = useSignIn()

  const codeSchema = z.object({
    code: z.string().min(6).max(6)
  })

  type CodeInput = z.infer<typeof codeSchema>

  const { control, formState, handleSubmit } = useForm<CodeInput>({
    resolver: zodResolver(codeSchema)
  })

  async function onSubmit(data: CodeInput) {
    if (!isLoaded || !signIn) return

    try {
      const { createdSessionId } = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code: data.code
      })

      if (createdSessionId) {
        await setActive({
          session: createdSessionId
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function sendCode() {
    if (isSendingCode || !isLoaded) return;
    try {
      const { phoneNumber } = route.params

      const { supportedFirstFactors } = await signIn.create({
        identifier: `+1${phoneNumber}`,
      })

      const firstPhoneFactor = supportedFirstFactors.find(factor => {
        return factor.strategy === 'phone_code'
      });

      if (!firstPhoneFactor) {
        throw new Error("No phone factor found")
      }

      // TODO: This does exist
      const { phoneNumberId } = firstPhoneFactor;

      await signIn.prepareFirstFactor({
        strategy: "phone_code",
        phoneNumberId,
      })
    } catch (e) {
      console.log(e)
    } finally {
      setIsSendingCode(false)
      setNextCodeSendTimer(60)
    }
  }

  useEffect(() => {
    if (nextCodeSendTimer <= 0) return;

    const timer = setTimeout(() => {
      setNextCodeSendTimer(nextCodeSendTimer - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [nextCodeSendTimer])

  useEffect(() => {
    if (!isLoaded) return;

    sendCode()
  }, [isLoaded])

  return (
    <ScreenWrapper>
      <View className="flex flex-col gap-5 mt-5">
        <Text
          h2
          style={{
            textAlign: 'center',
            color: colors.text,
          }}
        >
          Verification Code
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.text,
          }}
        >
          We have sent a verification code to your phone number.
        </Text>
        <View>
          <Text
            style={{
              textAlign: 'center',
              color: colors.text,
            }}
          >
            Please enter the 6 digit code below.
          </Text>
        </View>

        <View>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, value } }) => (
              <InputField
                value={value}
                onChangeText={onChange}
                placeholder="Verification Code"
                keyboardType="number-pad"
                style={{
                  textAlign: 'center',
                  color: colors.text,
                }}
              />
            )}
          />
        </View>

        <Button
          color="primary"
          disabled={!formState.isValid || formState.isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          Verify
        </Button>

        <Button
          disabled={nextCodeSendTimer > 0 || isSendingCode}
          color="secondary"
          onPress={sendCode}
        >
          {nextCodeSendTimer > 0 ? `Resend in ${nextCodeSendTimer}` : 'Resend Code'}
        </Button>
      </View>
    </ScreenWrapper>
  )
}
