import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomSearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
    value,
    onChangeText,
    placeholder
}) => {
    return (
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 border-gray-200 border">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                className="flex-1 ml-2 text-base"
            />
        </View>
    );
};

export default CustomSearchBar;