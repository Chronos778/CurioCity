import React, { memo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../hooks/useAppTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

const LocalRestaurants = memo(({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity 
      className="mr-5 rounded-3xl overflow-hidden"
      style={{ 
        width: CARD_WIDTH,
        backgroundColor: colors.cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 10,
      }}
      onPress={() => onItemPress(item)}
    >
      <View className="w-full relative">
        <View className="h-80 w-full items-center justify-center bg-gradient-to-br" style={{ backgroundColor: colors.primary + '20' }}>
          <Ionicons name="restaurant" size={64} color={colors.primary} opacity={0.4} />
          <Text className="text-sm text-gray-400 font-medium mt-3">Restaurant Image</Text>
        </View>
        
        {/* Gradient blur overlay at bottom of image */}
        <LinearGradient
          colors={['transparent', colors.cardBackground]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
          }}
        />
      </View>
      
      <View className="p-6">
        <Text className="font-bold text-xl mb-3" numberOfLines={2} style={{ color: colors.textPrimary }}>
          {item.name}
        </Text>
        
        <View className="flex-row items-center justify-between mb-4">
          {item.categories && item.categories.length > 0 && (
            <View className="flex-row items-center flex-1 mr-2">
              <Ionicons name="fast-food" size={16} color={colors.textSecondary} />
              <Text className="text-sm font-medium ml-2 flex-1" numberOfLines={1} style={{ color: colors.textSecondary }}>
                {item.categories.join(' • ')}
              </Text>
            </View>
          )}
          {item.rating && (
            <View className="flex-row items-center px-3 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '20' }}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text className="text-sm font-bold ml-1.5" style={{ color: colors.textPrimary }}>{item.rating}</Text>
            </View>
          )}
        </View>
        
        <View className="flex-row items-center justify-between">
          {item.distance && (
            <View className="flex-row items-center">
              <Ionicons name="navigate" size={16} color={colors.primary} />
              <Text className="text-sm font-medium ml-2" style={{ color: colors.textSecondary }}>
                {(item.distance / 1000).toFixed(1)} km away
              </Text>
            </View>
          )}
          <View className="px-5 py-2.5 rounded-full" style={{ backgroundColor: colors.primary }}>
            <Text className="text-sm font-bold text-white">View Menu</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [colors, onItemPress]);

  const keyExtractor = useCallback((item, index) => `restaurant-${index}`, []);

  return (
    <View className="mb-2" style={{ overflow: 'visible' }}>
      <View className="flex-row items-center justify-center px-6 mb-5">
        <View className="h-[1px] flex-1" style={{ backgroundColor: colors.border }} />
        <Text className="text-lg font-bold mx-4 tracking-widest uppercase" style={{ color: colors.textPrimary }}>
          Local Restaurants
        </Text>
        <View className="h-[1px] flex-1" style={{ backgroundColor: colors.border }} />
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 20 }}
        initialScrollIndex={data.length >= 3 ? Math.floor(data.length / 2) : 0}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + 20,
          offset: (CARD_WIDTH + 20) * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </View>
  );
});

LocalRestaurants.displayName = 'LocalRestaurants';

export default LocalRestaurants;
