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

const PlacesDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const places = location.placesToVisit || [];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance > 1000 ? `${(distance / 1000).toFixed(1)}km` : `${Math.round(distance)}m`;
  };

  const getPlaceTypeIcon = (type) => {
    if (!type) return 'location';
    if (type.includes('museum')) return 'library';
    if (type.includes('park')) return 'leaf';
    if (type.includes('monument')) return 'trophy';
    if (type.includes('temple') || type.includes('church')) return 'flower';
    if (type.includes('beach')) return 'water';
    if (type.includes('market')) return 'storefront';
    return 'camera';
  };
  const formatPlaceType = (type) => {
    if (!type) return 'Attraction';
    return type.split(',').map(t => 
      t.trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).slice(0, 2).join(', ');
  };

  const renderPlaceItem = ({ item: place, index }) => (
    <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#FF6B6B20' }}>
          <Ionicons 
            name={getPlaceTypeIcon(place.type)} 
            size={SIZES.iconMedium} 
            color="#FF6B6B" 
          />
        </View>
        <View className="flex-1 mx-3">
          <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>{place.name}</Text>
          <Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>{formatPlaceType(place.type)}</Text>
        </View>
        {place.distance && (
          <View className="flex-row items-center">
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.primary} />
            <Text className="text-xs ml-1" style={{ color: colors.primary }}>{formatDistance(place.distance)}</Text>
          </View>
        )}
      </View>

      <View className="gap-2">
        {place.rating > 0 && (
          <View className="flex-row items-center">
            <Ionicons name="star" size={SIZES.iconSmall} color="#FFD700" />
            <Text className="text-xs ml-2" style={{ color: colors.textSecondary }}>Rating: {place.rating}/10</Text>
          </View>
        )}
        
        <View className="flex-row items-center">
          <Ionicons name="navigate" size={SIZES.iconSmall} color={colors.textSecondary} />          <Text className="flex-1 text-xs ml-2" numberOfLines={1} ellipsizeMode="tail" style={{ color: colors.textSecondary }}>
            {place.coordinates?.latitude?.toFixed(3) || '0.000'}, {place.coordinates?.longitude?.toFixed(3) || '0.000'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient        colors={[colors.primary, colors.primaryDark]}
        className="flex-row items-center px-4 py-3 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <TouchableOpacity
          className="p-2"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-center" style={{ color: colors.textWhite }}>Places to Visit</Text>
        <View className="p-2">
          <Ionicons name="camera" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View className="flex-row mx-4 my-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{places.length}</Text>
          <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Places Found</Text>
        </View>
        <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {places.filter(place => place.rating && place.rating >= 4).length}
          </Text>
          <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Top Rated</Text>
        </View>
        <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {places.filter(place => place.type?.toLowerCase().includes('museum')).length}
          </Text>          <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Museums</Text>
        </View>
        </View>

        {places.length > 0 ? (
          <>            <View className="px-4 mb-3">
              <Text className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>Places to Visit</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>Tourist attractions and points of interest in {location.name}</Text>
            </View>
            
            <View className="px-4">
            <FlatList
              data={places}
              renderItem={renderPlaceItem}
              keyExtractor={(item, index) => `place-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center px-8 py-16">
            <Ionicons name="camera-outline" size={60} color={colors.textSecondary} />
            <Text className="text-xl font-bold mt-4 text-center" style={{ color: colors.textPrimary }}>No Places Found</Text>
            <Text className="text-sm mt-2 text-center" style={{ color: colors.textSecondary }}>
              We couldn't find any tourist attractions for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default PlacesDetailScreen;
