// import React from "react";
// import { View, TextInput, Text, TextInputProps } from "react-native";
// import clsx from "clsx";

// type CustomInputProps = {
//   label?: string;
//   value: string;
//   compulsory?: boolean
//   onChangeText: (text: string) => void;
//   placeholder?: string;
//   inputProps?: TextInputProps;
//   disabled? : boolean
// };

// const CustomInput: React.FC<CustomInputProps> = ({
//   label,
//   compulsory = false,
//   value,
//   onChangeText,
//   placeholder,
//   inputProps,
//   disabled = false
// }) => {
//   return (
//     <View className="mb-6">
//       {label &&
//         <Text className="text-base font-semibold mb-1 text-black">
//           {label} {compulsory && <Text className="text-red-500">*</Text>}
//         </Text>}

//       <TextInput
//         value={value}
//         editable={!disabled}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         className={clsx(
//           "border border-gray-400 rounded-lg px-4 py-3 text-base text-black bg-white",
//           disabled && "bg-gray-200"
//         )}
//         placeholderTextColor={"gray"}
//         {...inputProps}
//       />
//     </View>
//   );
// };

// export default CustomInput;


import React from "react";
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import clsx from "clsx";
import Checkbox from "expo-checkbox";

type CustomInputProps = {
  label?: string;
  value: string;
  compulsory?: boolean;
  onChangeText: (text: string) => void;
  placeholder?: string;
  inputProps?: TextInputProps;
  disabled?: boolean;
  errorMessage?: string;
  onChangeAction?: () => void;
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  onCheckboxChange?: (value: boolean) => void;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  compulsory = false,
  value,
  onChangeText,
  placeholder,
  inputProps,
  disabled = false,
  errorMessage,
  onChangeAction,
  checkboxLabel,
  checkboxChecked = false,
  onCheckboxChange,
  keyboardType = 'default',
  autoCapitalize = "sentences",
}) => {
  return (
    <View className="mb-6">
      {/* Label */}
      {label && (
        <Text className="text-lg font-semibold mb-2 text-black">
          {label}
          {compulsory && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      {/* Input Field */}
      <TextInput
        value={value}
        editable={!disabled}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        className={clsx(
          "border border-gray-400 rounded-lg px-4 py-4 text-xl text-black bg-white",
          disabled && "bg-gray-200"
        )}
        placeholderTextColor={"gray"}
        autoCapitalize={autoCapitalize}
        {...inputProps}
      />

      {/* Error Message or Change Action */}
      {errorMessage && (
        <View className="flex-row mt-1">
          <Text className="text-xs text-red-500 mr-1">{errorMessage}</Text>
          {onChangeAction && (
            <TouchableOpacity onPress={onChangeAction}>
              <Text className="text-xs text-orange-500 font-semibold">
                Change
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Checkbox */}
      {checkboxLabel && onCheckboxChange && (
        <View className="flex-row items-center mt-2">
          <Checkbox
            value={checkboxChecked}
            onValueChange={onCheckboxChange}
            color={checkboxChecked ? "#f59e0b" : undefined} // Orange when checked
          />
          <Text className="ml-2 text-black">{checkboxLabel}</Text>
        </View>
      )}
    </View>
  );
};

export default CustomInput;
