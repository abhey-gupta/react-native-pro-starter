import { View, Modal, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import CustomText from "./custom-text";
import CustomButton from "./custom-button";

interface CustomPopupProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  variant?: "success" | "danger" | "info";
  children: React.ReactNode;
  animationType?: "slide" | "fade";
  confirmText?: string;
  confirmButtonLoading?: boolean;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({
  visible,
  onClose,
  onConfirm,
  children,
  title,
  confirmText = "Confirm",
  variant = "success",
  animationType = "slide",
  confirmButtonLoading = false,
}) => {
  const translateY = useSharedValue(500);
  const opacity = useSharedValue(0);

  const baseColor =
    variant === "success"
      ? "bg-green-500"
      : variant === "danger"
      ? "bg-red-500"
      : "bg-blue-500";

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(500);
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: animationType === "slide" ? translateY.value : 0,
      },
    ],
    opacity: animationType === "fade" ? opacity.value : 1,
  }));

  const BackButton = () => {
    return (
      <TouchableOpacity
        onPress={onClose}
        className="rounded-2xl p-4 w-1/2 border border-gray-300"
      >
        <CustomText className="text-center font-semibold text-gray-700">
          Back
        </CustomText>
      </TouchableOpacity>
    );
  };

  const ActionButton = () => {
    return (
      <CustomButton
        buttonType="opacity"
        onPress={onConfirm}
        className={`rounded-2xl p-4 w-1/2 ${baseColor}`}
        isLoading={confirmButtonLoading}
      >
        <CustomText className="text-white text-center font-semibold">
          {confirmText}
        </CustomText>
      </CustomButton>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-center items-center"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="w-[85%] max-w-[400px]">
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Animated.View
              className="bg-white rounded-xl p-5 shadow-lg"
              style={animatedStyle}
            >
              <CustomText className="text-center font-semibold text-gray-700 text-lg">
                {title}
              </CustomText>
              {children}
              <View className="flex-row justify-between gap-2 mt-5">
                <BackButton />
                <ActionButton />
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
