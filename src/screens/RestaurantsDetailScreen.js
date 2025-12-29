import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';

const RestaurantsDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const restaurants = location.restaurants || [];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance > 1000 ? `${(distance / 1000).toFixed(1)}km` : `${Math.round(distance)}m`;
  };
  const getRatingStars = (rating) => {
    if (!rating) return '☆☆☆☆☆';
    const stars = Math.round(rating);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  const renderRestaurantItem = ({ item: restaurant, index }) => (
    <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-bold mb-2" style={{ color: colors.textPrimary }}>{restaurant.name}</Text>
          {restaurant.rating && (
            <View className="flex-row items-center">
              <Text className="text-sm mr-1" style={{ color: '#FFD700' }}>{getRatingStars(restaurant.rating)}</Text>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>({restaurant.rating})</Text>
            </View>
          )}
        </View>
        {restaurant.distance && (
          <View className="flex-row items-center ml-2">
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.primary} />
            <Text className="text-xs ml-1" style={{ color: colors.primary }}>{formatDistance(restaurant.distance)}</Text>
          </View>
        )}
      </View>

      {restaurant.categories && restaurant.categories.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-3">
          {restaurant.categories.slice(0, 3).map((category, catIndex) => (
            <View key={catIndex} className="px-2 py-1 rounded-md" style={{ backgroundColor: colors.background }}>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>{category}</Text>
            </View>
          ))}
        </View>
      )}

      {restaurant.address && (
        <View className="flex-row items-start">
          <Ionicons name="map" size={SIZES.iconSmall} color={colors.textSecondary} />
          <Text className="flex-1 text-xs ml-2" style={{ color: colors.textSecondary }}>{restaurant.address}</Text>
        </View>
      )}
    </View>
  );

  return (    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        className="flex-row items-center px-4 py-3 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <TouchableOpacity
          className="p-2"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-center" style={{ color: colors.textWhite }}>Restaurants</Text>
        <View className="p-2">
          <Ionicons name="restaurant" size={24} color={colors.textWhite} />
        </View></LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View className="flex-row mx-4 my-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{restaurants.length}</Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Restaurants</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {restaurants.filter(restaurant => restaurant.rating && restaurant.rating >= 4).length}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Highly Rated</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {restaurants.filter(restaurant => restaurant.categories?.some(cat => cat.toLowerCase().includes('fine'))).length}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Fine Dining</Text>
          </View>
        </View>        {restaurants.length > 0 ? (
          <>
            <View className="px-4 mb-3">
              <Text className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>Local Restaurants</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>Dining options and culinary experiences in {location.name}</Text>
            </View>
            
            <View className="px-4">
            <FlatList
              data={restaurants}
              renderItem={renderRestaurantItem}
              keyExtractor={(item, index) => `restaurant-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
            </View>
          </>
        ) : (<View className="flex-1 items-center justify-center px-8 py-16">
            <Ionicons name="restaurant-outline" size={60} color={colors.textSecondary} />
            <Text className="text-xl font-bold mt-4 text-center" style={{ color: colors.textPrimary }}>No Restaurants Found</Text>
            <Text className="text-sm mt-2 text-center" style={{ color: colors.textSecondary }}>
              We couldn't find any restaurants for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RestaurantsDetailScreen;
