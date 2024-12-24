import { View, Text } from "react-native";
import React from "react";
import CustomText from "../components/ui/custom-text";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const Index = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(app)"} />;
  }
  return (
    <View>
      <Link href={"/(app)"}>
        <CustomText>
          <Text>Go to app</Text>
        </CustomText>
      </Link>

      <Link href={"/(auth)/sign-in"}>
        <CustomText>
          <Text>Go to sign in</Text>
        </CustomText>
      </Link>
    </View>
  );
};

export default Index;
