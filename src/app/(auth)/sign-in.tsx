import {
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";
import CustomText from "@/src/components/ui/custom-text";
import CustomButton from "@/src/components/ui/custom-button";
import { useEffect, useState } from "react";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
  useUser,
} from "@clerk/clerk-expo";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "@/src/libs/api";
import { PhoneCodeFactor, SignInFirstFactor } from "@clerk/types";
import { ClerkAPIError } from "@clerk/types";

const CELL_COUNT = 6;
const RESEND_DELAY = 30; // 30 seconds delay for resend OTP

export default function SignIn() {
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const {
    isLoaded: isSignInLoaded,
    signIn,
    setActive: setSignInActive,
  } = useSignIn();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUserExists, setIsUserExists] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errors, setErrors] = useState<ClerkAPIError[]>();

  const insets = useSafeAreaInsets();

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && pendingVerification) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer, pendingVerification]);

  const startResendTimer = () => {
    setResendTimer(RESEND_DELAY);
  };

  const handleAuth = async () => {
    setIsLoading(true);
    setErrors(undefined);
    try {
      const { data } = await api.get(`/api/users/${phoneNumber}`);
      console.log("data", data);

      if (data.user) {
        setIsUserExists(true);
        await handleSignIn();
      } else {
        setIsUserExists(false);
        await handleSignUp();
      }
      startResendTimer();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!isSignInLoaded) return;
    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: `+91${phoneNumber}`,
      });

      const isPhoneCodeFactor = (
        factor: SignInFirstFactor
      ): factor is PhoneCodeFactor => {
        return factor.strategy === "phone_code";
      };
      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (phoneCodeFactor) {
        const { phoneNumberId } = phoneCodeFactor;
        await signIn.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });
        setPendingVerification(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
      console.log(error);
    }
  };

  const handleSignUp = async () => {
    if (!isSignUpLoaded || !signUp) return;
    try {
      await signUp.create({
        phoneNumber: `+91${phoneNumber}`,
      });
      await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
      setPendingVerification(true);
    } catch (error) {
      Alert.alert("Error", "Failed to create account. Please try again.");
      console.log(error);
    }
  };

  const onVerifyPress = async () => {
    setIsLoading(true);
    setErrors(undefined);

    try {
      if (isUserExists) {
        console.log("is user exists");
        await onSignInVerifyPress();
      } else {
        console.log("is user not exists");
        await onSignUpVerifyPress();
      }
    } catch (error) {
      console.log("error in on verify press", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpVerifyPress = async () => {
    if (!isSignUpLoaded || !signUp) return;
    console.log("verifying signup");

    try {
      const signUpAttempt = await signUp.attemptPhoneNumberVerification({
        code: value,
      });
      console.log("signup attempt", signUpAttempt);

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        const { user } = useUser();
        console.log("user after succsesfull signup is : ", user);

        router.back();
      } else {
        console.log("signup incomplete");
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      }
      console.error("signup error: ", JSON.stringify(error, null, 2));
    }
  };

  const onSignInVerifyPress = async () => {
    if (!isSignInLoaded || !signIn) return;

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code: value,
      });

      if (signInAttempt.status === "complete") {
        await setSignInActive({ session: signInAttempt.createdSessionId });
        router.back();
      } else {
        console.log("signin incomplete");
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      }
      console.log("signin error: ", JSON.stringify(error, null, 2));
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setValue("");
    await handleAuth();
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-1 bg-white pt-12">
          <View className="px-12 flex-1">
            <View className="space-y-4">
              <CustomText className="text-xl font-semibold">
                Enter the OTP sent to
              </CustomText>
              <CustomText className="text-xl font-semibold">
                +91 {phoneNumber}
              </CustomText>
            </View>

            <View className="mt-8">
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={{ marginTop: 20 }}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    key={index}
                    className={`w-12 h-12 border-b-2 mx-2 justify-center items-center ${
                      isFocused ? "border-[#E48F45]" : "border-gray-300"
                    }`}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    <CustomText className="text-2xl">
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </CustomText>
                  </View>
                )}
              />
            </View>

            <Pressable onPress={handleResendOTP} disabled={resendTimer > 0}>
              <CustomText className="text-xs text-gray-500 mt-4">
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : "Tap to resend OTP"}
              </CustomText>
            </Pressable>
            {errors && (
              <View className="mt-4">
                {errors.map((el, index) => (
                  <CustomText className="text-red-500" key={index}>
                    {el.longMessage}
                  </CustomText>
                ))}
              </View>
            )}

            <View className="mt-auto mb-8">
              <CustomButton
                onPress={onVerifyPress}
                disabled={value.length !== CELL_COUNT || isLoading}
                isLoading={isLoading}
              >
                Verify & Continue
              </CustomButton>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View className="flex-1 bg-white px-12 justify-center">
      <View className="items-center mb-12 gap-2">
        <Pressable onPress={() => router.back()}>
          <Image
            source={require("@/assets/images/logo/logo.png")}
            className="w-40 h-20"
            resizeMode="contain"
          />
        </Pressable>
        <CustomText className="text-2xl font-semibold text-center">
          Login and explore your city
        </CustomText>
      </View>

      <View className="space-y-6 gap-5">
        <View className="flex-row border border-gray-200 rounded-2xl px-3 py-4 items-center">
          <CustomText className="text-gray-500">+91</CustomText>
          <TextInput
            className="flex-1 ml-2"
            placeholder="Enter mobile number"
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <CustomButton
          onPress={handleAuth}
          isLoading={isLoading}
          disabled={phoneNumber.length !== 10 || isLoading}
        >
          Get OTP
        </CustomButton>
      </View>
      <View className="h-52" />
    </View>
  );
}
