import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomText from "src/components/custom-text";
import CustomButton from "./custom-button";

type HeaderProps = {
  title: string;
  goBack?: boolean;
  headerRight?: React.ReactNode;
};

export default function ScreenHeader({
  title,
  goBack = true,
  headerRight,
}: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between py-3 px-4">
      <View className="flex-row items-center gap-3">
        {goBack ? (
          <TouchableOpacity
            onPress={() => {
              if (goBack) router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
        <CustomText className="text-2xl font-semibold">{title}</CustomText>
      </View>

      {headerRight ?? null}
    </View>
  );
}
