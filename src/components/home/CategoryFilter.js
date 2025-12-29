import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const CategoryFilter = ({ onCategorySelect }) => {
  const { colors } = useAppTheme();
  const categories = ['Hotels', 'Restaurants', 'Services'];

  return (
    <View className="my-8">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            className="px-8 py-3 rounded-full mr-4 border"
            style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => onCategorySelect(category)}
          >
            <Text className="font-semibold text-base" style={{ color: colors.textPrimary }}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryFilter;
