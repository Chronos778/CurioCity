import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const LocalRestaurants = ({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      className="mr-5 w-72 rounded-2xl overflow-hidden border"
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
      <View className="h-40 w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
        <Text className="text-sm text-gray-500 font-medium">Dish Image</Text>
      </View>
      
      <View className="p-5">
        <Text className="font-bold text-lg mb-3" numberOfLines={1} style={{ color: colors.textPrimary }}>
          {item.name}
        </Text>
        
        <View className="flex-row items-center justify-between">
          <View className="px-4 py-1.5 rounded-full border" style={{ borderColor: colors.textSecondary }}>
            <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>Details</Text>
          </View>
          
          <View className="flex-row items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
            <Text className="text-xs mr-1 font-medium" style={{ color: colors.textPrimary }}>Review</Text>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text className="text-xs ml-1 font-bold" style={{ color: colors.textPrimary }}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-center px-6 mb-6">
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
        <Text className="text-xl font-bold mx-4 tracking-wide" style={{ color: colors.textPrimary }}>
          Local Restaurants
        </Text>
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `restaurant-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      />
    </View>
  );
};

export default LocalRestaurants;
