import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';

const ServicesList = memo(({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  return (
    <View className="mb-8 px-6">
      <View className="flex-row items-center justify-center mb-6">
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
        <Text className="text-xl font-bold mx-4 tracking-wide" style={{ color: colors.textPrimary }}>
          Services & Amenities
        </Text>
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
      </View>
      
      <View 
        className="rounded-3xl overflow-hidden border h-64"
        style={{ 
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {data.map((item, index) => (
            <TouchableOpacity 
              key={index}
              className="p-5 border-b flex-row justify-between items-center"
              style={{ borderBottomColor: colors.border }}
              onPress={() => onItemPress(item)}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-4">
                    <Ionicons name="business" size={20} color={colors.primary} />
                </View>
                <Text className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                    {item.name}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-xs mr-2 font-medium" style={{ color: colors.textSecondary }}>
                    Details
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
});

ServicesList.displayName = 'ServicesList';

export default ServicesList;
