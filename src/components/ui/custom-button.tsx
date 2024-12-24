import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
  TouchableHighlightProps,
  TouchableWithoutFeedbackProps,
} from "react-native";
import CustomText from "./custom-text";

type ButtonType = "opacity" | "highlight" | "withoutFeedback";

interface BaseButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  buttonType?: ButtonType;
  className?: string;
}

type TouchableProps =
  | TouchableOpacityProps
  | TouchableHighlightProps
  | TouchableWithoutFeedbackProps;

type CustomButtonProps = BaseButtonProps & TouchableProps;

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  buttonType = "opacity",
  className = "",
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const buttonStyle = `px-4 py-4 rounded-2xl ${
    isDisabled ? "bg-disabled" : "bg-primary"
  } ${className}`;

  const textStyle = `text-center font-medium ${
    isDisabled ? "text-disabled-text" : "text-white"
  } `;

  const content = (
    <>
      {isLoading ? (
        <ActivityIndicator color={isDisabled ? "white" : "#fff"} />
      ) : typeof children === "string" ? (
        <CustomText className={textStyle}>{children}</CustomText>
      ) : (
        children
      )}
    </>
  );

  switch (buttonType) {
    case "highlight":
      return (
        <TouchableHighlight
          className={buttonStyle}
          disabled={isDisabled}
          {...(props as TouchableHighlightProps)}
        >
          {content}
        </TouchableHighlight>
      );
    case "withoutFeedback":
      return (
        <TouchableWithoutFeedback
          disabled={isDisabled}
          {...(props as TouchableWithoutFeedbackProps)}
        >
          <View className={buttonStyle}>{content}</View>
        </TouchableWithoutFeedback>
      );
    default:
      return (
        <TouchableOpacity
          className={buttonStyle}
          disabled={isDisabled}
          {...(props as TouchableOpacityProps)}
        >
          {content}
        </TouchableOpacity>
      );
  }
};

export default CustomButton;
