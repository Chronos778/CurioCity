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

const AccommodationDetailScreen = ({ navigation, route }) => {
  const { accommodation = [], location } = route.params || {};
  const { colors, isDarkMode } = useAppTheme();

  const renderAccommodationItem = ({ item, index }) => (
    <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-bold mb-1" style={{ color: colors.textPrimary }}>{item.name}</Text>
          <View className="px-2 py-1 rounded self-start" style={{ backgroundColor: colors.background }}>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>{item.type || 'Hotel'}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          {item.rating && (
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text className="text-sm ml-1 font-semibold" style={{ color: colors.textPrimary }}>{item.rating}</Text>
            </View>
          )}
          <Ionicons name="bed-outline" size={20} color={colors.primary} />
        </View>
      </View>
      
      {item.address && (
        <View className="flex-row items-start mb-2">
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text className="flex-1 text-xs ml-2" style={{ color: colors.textSecondary }}>{item.address}</Text>
        </View>
      )}
      
      {item.amenities && item.amenities.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-2">
          {item.amenities.slice(0, 3).map((amenity, amenityIndex) => (
            <View key={amenityIndex} className="px-2 py-1 rounded-md" style={{ backgroundColor: colors.background }}>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>{amenity}</Text>
            </View>
          ))}
        </View>
      )}
      
      {item.distance && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="walk-outline" size={16} color={colors.textSecondary} />
          <Text className="text-xs ml-2" style={{ color: colors.textSecondary }}>{Math.round(item.distance)}m away</Text>
        </View>
      )}
      
      {item.priceRange && (
        <View className="flex-row items-center mb-2">
          <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>Price Range:</Text>
          <Text className="text-xs ml-2" style={{ color: colors.textPrimary }}>{item.priceRange}</Text>
        </View>
      )}
      
      <Text className="text-xs mt-2" style={{ color: colors.textSecondary }}>Source: {item.source}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name="bed-outline" size={64} color={colors.textSecondary} />
      <Text className="text-xl font-bold mt-4 text-center" style={{ color: colors.textPrimary }}>No Accommodation Found</Text>
      <Text className="text-sm mt-2 text-center" style={{ color: colors.textSecondary }}>
        We couldn't find any hotels or accommodation options in this area. 
        Try searching for nearby cities or check back later.
      </Text>
      <TouchableOpacity 
        className="mt-4 px-6 py-3 rounded-lg"
        style={{ backgroundColor: colors.primary }}
        onPress={() => navigation.goBack()}
      >
        <Text className="text-sm font-semibold" style={{ color: colors.textWhite }}>Search Other Locations</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <LinearGradient
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
        <Text className="flex-1 text-lg font-semibold text-center" style={{ color: colors.textWhite }}>Accommodation</Text>
        <View className="p-2">
          <Ionicons name="bed" size={24} color={colors.textWhite} />
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row mx-4 my-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{accommodation.length}</Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Hotels Found</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {accommodation.filter(item => item.rating && item.rating >= 4).length}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Highly Rated</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {accommodation.filter(item => item.type?.toLowerCase().includes('luxury')).length}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Luxury Options</Text>
          </View>
        </View>

        {accommodation.length > 0 ? (
          <>
            <View className="px-4 mb-3">
              <Text className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>Available Accommodation</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>Hotels, resorts, and lodging options</Text>
            </View>
            
            <View className="px-4">
            <FlatList
              data={accommodation}
              renderItem={renderAccommodationItem}
              keyExtractor={(item, index) => `accommodation-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
            </View>
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccommodationDetailScreen;
