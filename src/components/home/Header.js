import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const Header = ({ cityName }) => {
  const { colors, toggleTheme, isDarkMode } = useAppTheme();

  return (
    <View className="flex-row items-center justify-between px-6 py-4 mt-2">
      <View className="flex-row items-center">
        <Text className="text-3xl font-bold mr-2 tracking-tight" style={{ color: colors.textPrimary }}>
          {cityName}
        </Text>
        <Ionicons name="location" size={28} color={colors.primary} />
      </View>
      <TouchableOpacity 
        onPress={toggleTheme}
        className="w-12 h-12 rounded-full items-center justify-center bg-gray-100 dark:bg-gray-800"
      >
        <Ionicons 
          name={isDarkMode ? "sunny" : "moon"} 
          size={24} 
          color={colors.textPrimary} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
