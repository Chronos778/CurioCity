import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const HolyPlaces = ({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      className="mr-5 w-48 h-64 rounded-2xl overflow-hidden border"
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
      <View className="flex-1 items-center justify-center bg-gray-200 dark:bg-gray-700 p-4">
        <Text className="text-sm text-gray-500 font-medium mb-4">Holy Place Image</Text>
        <Text className="text-lg font-bold text-center" style={{ color: colors.textPrimary }}>{item.name}</Text>
        <Text className="text-xs mt-2 text-center opacity-70" style={{ color: colors.textSecondary }}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-center px-6 mb-6">
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
        <Text className="text-xl font-bold mx-4 tracking-wide" style={{ color: colors.textPrimary }}>
          Holy Places
        </Text>
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `holy-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      />
    </View>
  );
};

export default HolyPlaces;
