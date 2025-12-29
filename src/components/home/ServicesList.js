import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';

const ServicesList = memo(({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  const getBackgroundColor = () => {
    // Get the actual background color from the theme
    return colors.background || '#FFFFFF';
  };

  return (
    <View className="mb-10 px-6">
      <View className="flex-row items-center justify-center mb-8">
        <View className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600" />
        <Text className="text-2xl font-bold mx-6 tracking-wide" style={{ color: colors.textPrimary }}>
          Services & Amenities
        </Text>
        <View className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600" />
      </View>
      
      <View 
        className="overflow-hidden h-[500px] relative"
      >
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}>
          {data.map((item, index) => (
            <TouchableOpacity 
              key={index}
              className="p-6 flex-row justify-between items-center"
              onPress={() => onItemPress(item)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-5">
                    <Ionicons name="business" size={26} color={colors.primary} />
                </View>
                <Text className="font-bold text-lg flex-1" style={{ color: colors.textPrimary }}>
                    {item.name}
                </Text>
              </View>
              <View className="flex-row items-center ml-3">
                <Text className="text-sm mr-2 font-semibold" style={{ color: colors.textSecondary }}>
                    Details
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <LinearGradient
          colors={[getBackgroundColor(), 'transparent']}
          className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
        />
        <LinearGradient
          colors={['transparent', getBackgroundColor()]}
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        />
      </View>
    </View>
  );
});

ServicesList.displayName = 'ServicesList';

export default ServicesList;
