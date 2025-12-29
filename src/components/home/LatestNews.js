import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const LatestNews = memo(({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  return (
    <View className="mb-8 px-6">
      <View className="flex-row items-center justify-center mb-6">
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
        <Text className="text-xl font-bold mx-4 tracking-wide" style={{ color: colors.textPrimary }}>
          Latest News
        </Text>
        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
      </View>
      
      <View 
        className="rounded-3xl overflow-hidden border h-80"
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
              className="p-5 border-b"
              style={{ borderBottomColor: colors.border }}
              onPress={() => onItemPress(item)}
            >
              <View className="flex-row">
                <View className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl mr-4 items-center justify-center">
                    <Text className="text-[10px] text-gray-500 font-medium">News Image</Text>
                </View>
                <View className="flex-1 justify-center">
                    <Text className="font-bold text-base mb-2 leading-5" style={{ color: colors.textPrimary }}>
                        {item.title}
                    </Text>
                    <Text className="text-sm leading-5" numberOfLines={2} style={{ color: colors.textSecondary }}>
                        {item.description}
                    </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
});

LatestNews.displayName = 'LatestNews';

export default LatestNews;
