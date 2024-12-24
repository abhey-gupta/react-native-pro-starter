import { View, ViewStyle, StyleProp } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomSafeAreaView = ({
  children,
  style,
  className,
  allowTopInset = true,
  allowBottomInset = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  allowTopInset?: boolean;
  allowBottomInset?: boolean;
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={className}
      style={[
        {
          paddingTop: allowTopInset ? insets.top : 0,
          paddingBottom: allowBottomInset ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default CustomSafeAreaView;
