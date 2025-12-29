import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const NearbyAccommodation = memo(({ data, onItemPress, onViewMore }) => {
  const { colors } = useAppTheme();
  
  // Take only first 4 items for the grid
  const displayData = useMemo(() => data.slice(0, 4), [data]);

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-center px-6 mb-4">
        <View className="h-[1px] flex-1 bg-gray-300 dark:bg-gray-700" />
        <Text className="text-base font-bold mx-4 tracking-widest uppercase" style={{ color: colors.textPrimary }}>
          Nearby Accommodation
        </Text>
        <View className="h-[1px] flex-1 bg-gray-300 dark:bg-gray-700" />
      </View>
      
      <View className="flex-row flex-wrap justify-between px-4">
        {displayData.map((item, index) => (
          <TouchableOpacity 
            key={index}
            className="w-[48%] mb-4 rounded-xl overflow-hidden"
            style={{ 
              backgroundColor: colors.cardBackground,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4,
            }}
            onPress={() => onItemPress(item)}
          >
            <View className="h-48 w-full items-center justify-center bg-gray-300 dark:bg-gray-700">
              <Ionicons name="bed-outline" size={40} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 mt-2">Accommodation</Text>
            </View>
            
            <View className="p-3 pb-4">
              <Text className="font-bold text-base mb-1" numberOfLines={1} style={{ color: colors.textPrimary }}>
                {item.name}
              </Text>
              
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
                  <Ionicons name="star" size={12} color="#FFA500" />
                  <Text className="text-xs ml-1 font-bold" style={{ color: colors.textPrimary }}>
                    {item.rating}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  className="p-1"
                  onPress={() => onItemPress(item)}
                >
                  <Ionicons name="bookmark-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        className="self-center px-6 py-2.5 rounded-full border mt-6"
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.cardBackground,
        }}
        onPress={onViewMore}
      >
        <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
          View More Accommodation
        </Text>
      </TouchableOpacity>
    </View>
  );
});

NearbyAccommodation.displayName = 'NearbyAccommodation';

export default NearbyAccommodation;
