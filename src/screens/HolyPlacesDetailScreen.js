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

const HolyPlacesDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const holyPlaces = location.holyPlaces || [];
  const { colors, isDarkMode } = useAppTheme();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getReligionIcon = (religion) => {
    if (!religion) return 'flower';
    const rel = religion.toLowerCase();
    if (rel.includes('christian') || rel.includes('catholic')) return 'cross';
    if (rel.includes('islam') || rel.includes('muslim')) return 'moon';
    if (rel.includes('hindu')) return 'flame';
    if (rel.includes('buddhist')) return 'leaf';
    if (rel.includes('jewish')) return 'star';
    return 'flower';
  };

  const formatReligion = (religion) => {
    if (!religion) return 'Place of Worship';
    return religion.charAt(0).toUpperCase() + religion.slice(1);
  };

  const formatType = (type) => {
    if (!type) return '';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderHolyPlaceItem = ({ item: place, index }) => (
    <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#96CEB420' }}>
          <Ionicons 
            name={getReligionIcon(place.religion)} 
            size={SIZES.iconMedium} 
            color="#96CEB4" 
          />
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>{place.name}</Text>
          <Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>{formatReligion(place.religion)}</Text>
          {place.type && (
            <Text className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>{formatType(place.type)}</Text>
          )}
        </View>
      </View>

      <View className="gap-2">
        {place.address && (
          <View className="flex-row items-start">
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.textSecondary} />
            <Text className="flex-1 text-xs ml-2" numberOfLines={2} ellipsizeMode="tail" style={{ color: colors.textSecondary }}>{place.address}</Text>
          </View>
        )}

        <View className="flex-row items-center">
          <Ionicons name="navigate" size={SIZES.iconSmall} color={colors.textSecondary} />
          <Text className="flex-1 text-xs ml-2" numberOfLines={1} ellipsizeMode="tail" style={{ color: colors.textSecondary }}>
            {place.coordinates?.latitude?.toFixed(3) || '0.000'}, {place.coordinates?.longitude?.toFixed(3) || '0.000'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
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
        <Text className="flex-1 text-lg font-semibold text-center" style={{ color: colors.textWhite }}>Holy Places</Text>
        <View className="p-2">
          <Ionicons name="flower" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View className="flex-row mx-4 my-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{holyPlaces.length}</Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Sacred Sites</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {holyPlaces.filter(place => place.religion).length}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Different Faiths</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {holyPlaces.filter(place => place.type).length}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Place Types</Text>
          </View>
        </View>

        {holyPlaces.length > 0 ? (
          <>
            <View className="px-4 mb-3">
              <Text className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>Sacred Places</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>Places of worship and spiritual significance in {location.name}</Text>
            </View>
            
            <View className="px-4">
            <FlatList
              data={holyPlaces}
              renderItem={renderHolyPlaceItem}
              keyExtractor={(item, index) => `holy-place-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center px-8 py-16">
            <Ionicons name="flower-outline" size={60} color={colors.textSecondary} />
            <Text className="text-xl font-bold mt-4 text-center" style={{ color: colors.textPrimary }}>No Holy Places Found</Text>
            <Text className="text-sm mt-2 text-center" style={{ color: colors.textSecondary }}>
              We couldn't find any places of worship for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HolyPlacesDetailScreen;
