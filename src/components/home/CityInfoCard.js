import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const CityInfoCard = ({ description, onReadMore, onSearch }) => {
  const { colors } = useAppTheme();

  return (
    <View 
      className="mx-6 mt-4 p-6 rounded-3xl shadow-sm" 
      style={{ 
        backgroundColor: colors.cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <Text 
        className="text-lg mb-6 leading-7 font-medium" 
        numberOfLines={3} 
        style={{ color: colors.textSecondary }}
      >
        {description || "Loading city information..."}
      </Text>
      
      <View className="flex-row items-center justify-between">
        <TouchableOpacity 
          className="px-6 py-3 rounded-full border-2"
          style={{ borderColor: colors.primary }}
          onPress={onReadMore}
        >
          <Text className="font-bold text-base" style={{ color: colors.primary }}>
            Read more →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-14 h-14 rounded-full items-center justify-center shadow-md"
          style={{ backgroundColor: colors.primary }}
          onPress={onSearch}
        >
          <Ionicons name="search" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CityInfoCard;
