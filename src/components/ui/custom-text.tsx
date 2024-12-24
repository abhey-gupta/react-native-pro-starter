import { FC } from "react";
import { Text, TextStyle } from "react-native";
import { Fonts } from "../../utils/constants";

interface CustomTextProps {
  fontFamily?: Fonts;
  className?: string;
  children: React.ReactNode;
  numberOfLines?: number;
  onLayout?: (event: object) => void;
  style?: TextStyle[];
}

const CustomText: FC<CustomTextProps> = ({
  fontFamily = Fonts.PoppinsRegular,
  className,
  style,
  children,
  numberOfLines,
  onLayout,
  ...props
}) => {
  return (
    <Text
      style={[
        {
          fontFamily,
        },
        style,
      ]}
      className={className}
      numberOfLines={numberOfLines}
      onLayout={onLayout}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
