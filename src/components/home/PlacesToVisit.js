import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const PlacesToVisit = ({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      className="mr-5 w-40 rounded-2xl overflow-hidden border"
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
      <View className="h-48 w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
        <Text className="text-sm text-gray-500 font-medium">Place Photo</Text>
      </View>
      <View className="p-4">
        <Text className="font-bold text-base mb-1" numberOfLines={1} style={{ color: colors.textPrimary }}>
          {item.name}
        </Text>
        <Text className="text-sm font-medium" style={{ color: colors.primary }}>
          Details →
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-center px-6 mb-6">
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
        <Text className="text-xl font-bold mx-4 tracking-wide" style={{ color: colors.textPrimary }}>
          Places to Visit
        </Text>
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `place-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      />
    </View>
  );
};

export default PlacesToVisit;
