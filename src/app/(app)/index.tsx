import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { View, Text, Button } from "react-native";

const Index = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>inside app</Text>
      <Button
        title="Sign out"
        onPress={() => {
          signOut();
          router.push("/(auth)/sign-in");
        }}
      />
    </View>
  );
};

export default Index;
