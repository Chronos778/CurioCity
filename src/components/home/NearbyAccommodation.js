import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const NearbyAccommodation = ({ data, onItemPress, onViewMore }) => {
  const { colors } = useAppTheme();
  
  // Take only first 4 items for the grid
  const displayData = data.slice(0, 4);

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-center px-6 mb-6">
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
        <Text className="text-xl font-bold mx-4 tracking-wide" style={{ color: colors.textPrimary }}>
          Nearby Accommodation
        </Text>
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
      </View>
      
      <View className="flex-row flex-wrap justify-between px-6">
        {displayData.map((item, index) => (
          <TouchableOpacity 
            key={index}
            className="w-[48%] mb-4 rounded-2xl overflow-hidden border"
            style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
            onPress={() => onItemPress(item)}
          >
            <View className="h-32 w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
              <Text className="text-xs text-gray-500 font-medium">Hotel Image</Text>
            </View>
            
            <View className="p-3">
              <Text className="font-bold text-sm mb-2" numberOfLines={1} style={{ color: colors.textPrimary }}>
                {item.name}
              </Text>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Text className="text-xs mr-1 font-medium" style={{ color: colors.textSecondary }}>Detail</Text>
                    <Ionicons name="chevron-forward" size={12} color={colors.textSecondary} />
                </View>
                
                <View className="flex-row items-center bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded">
                  <Ionicons name="star" size={10} color="#FFD700" />
                  <Text className="text-xs ml-1 font-bold" style={{ color: colors.textPrimary }}>{item.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        className="self-center px-8 py-3 rounded-full border mt-2"
        style={{ borderColor: colors.textSecondary }}
        onPress={onViewMore}
      >
        <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
          View More Accommodation
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NearbyAccommodation;
