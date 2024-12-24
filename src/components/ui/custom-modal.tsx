import { Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

const CustomModal = ({
  children,
  isVisible,
  setIsVisible,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}) => {
  return isVisible ? (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className={`absolute h-full w-full bg-[#80808050] z-10`}
    >
      <Pressable className={`h-1/1`} onPress={() => setIsVisible(false)} />
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        className={`h-1/3 bg-white mt-auto items-center rounded-t-2xl`}
      >
        {children}
      </Animated.View>
    </Animated.View>
  ) : null;
};

export default CustomModal;
