import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';

const LocationDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleWikipediaLink = async () => {
    if (location.wikipediaUrl) {
      try {
        const supported = await Linking.canOpenURL(location.wikipediaUrl);
        if (supported) {
          await Linking.openURL(location.wikipediaUrl);
        }
      } catch (error) {
        console.error('Error opening Wikipedia link:', error);
      }
    }
  };

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
        <Text className="flex-1 text-lg font-semibold text-center mx-2" numberOfLines={1} style={{ color: colors.textWhite }}>
          {location.name}
        </Text>
        <View className="p-2">
          <Ionicons name="information-circle" size={24} color={colors.textWhite} />
        </View></LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Location Image - Only show if available */}
        {location.thumbnail && (
          <View className="w-full h-64">
            <Image
              source={{ uri: location.thumbnail }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Content Sections */}
        <View className="px-4 py-2">{/* About Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>About {location.name}</Text>
              {location.wikipediaUrl && (
                <TouchableOpacity 
                  className="flex-row items-center gap-1 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: colors.cardBackground }}
                  onPress={handleWikipediaLink}
                >
                  <Ionicons name="open-outline" size={SIZES.iconSmall} color={COLORS.primary} />
                  <Text className="text-sm font-medium" style={{ color: COLORS.primary }}>Wikipedia</Text>
                </TouchableOpacity>
              )}
            </View>            <Text className="text-base leading-6" style={{ color: colors.textSecondary }}>
              {location.fullDescription || location.description}
            </Text>
          </View>

          {/* Quick Facts Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>Quick Facts</Text>
            <View className="gap-3">
              <View className="flex-row items-center p-3 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
                <Ionicons name="flag" size={SIZES.iconMedium} color={COLORS.primary} />
                <View className="flex-1 ml-3">
                  <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Country</Text>
                  <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>{location.country}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center p-3 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
                <Ionicons name="map" size={SIZES.iconMedium} color={COLORS.primary} />
                <View className="flex-1 ml-3">
                  <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Region</Text>
                  <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>{location.region}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center p-3 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
                <Ionicons name="navigate" size={SIZES.iconMedium} color={COLORS.primary} />
                <View className="flex-1 ml-3">
                  <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Coordinates</Text>                  <Text className="text-base font-semibold" numberOfLines={1} ellipsizeMode="tail" style={{ color: colors.textPrimary }}>
                    {location.coordinates.latitude.toFixed(3)}, {location.coordinates.longitude.toFixed(3)}
                  </Text>
                </View>
              </View>
              
              {location.hasRealData && (
                <View className="flex-row items-center p-3 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
                  <Ionicons name="time" size={SIZES.iconMedium} color={COLORS.primary} />
                  <View className="flex-1 ml-3">
                    <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Data Updated</Text>
                    <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                      {new Date(location.lastUpdated).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              )}
            </View>          </View>
          
          {/* Real Data Summary */}
          {location.hasRealData && (
            <View className="mb-6">
              <Text className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>Live Data Summary</Text>
              <View className="flex-row flex-wrap justify-between">
                {location.news && location.news.length > 0 && (
                  <View className="w-[48%] mb-3 p-4 rounded-xl items-center" style={{ backgroundColor: colors.cardBackground }}>
                    <Ionicons name="newspaper" size={SIZES.iconMedium} color="#FFEAA7" />
                    <Text className="text-2xl font-bold mt-2" style={{ color: colors.textPrimary }}>{location.news.length}</Text>
                    <Text className="text-xs text-center mt-1" style={{ color: colors.textSecondary }}>News Articles</Text>
                  </View>
                )}
                
                {location.restaurants && location.restaurants.length > 0 && (
                  <View className="w-[48%] mb-3 p-4 rounded-xl items-center" style={{ backgroundColor: colors.cardBackground }}>
                    <Ionicons name="restaurant" size={SIZES.iconMedium} color="#4ECDC4" />
                    <Text className="text-2xl font-bold mt-2" style={{ color: colors.textPrimary }}>{location.restaurants.length}</Text>
                    <Text className="text-xs text-center mt-1" style={{ color: colors.textSecondary }}>Restaurants</Text>
                  </View>
                )}
                
                {location.placesToVisit && location.placesToVisit.length > 0 && (
                  <View className="w-[48%] mb-3 p-4 rounded-xl items-center" style={{ backgroundColor: colors.cardBackground }}>
                    <Ionicons name="camera" size={SIZES.iconMedium} color="#FF6B6B" />
                    <Text className="text-2xl font-bold mt-2" style={{ color: colors.textPrimary }}>{location.placesToVisit.length}</Text>
                    <Text className="text-xs text-center mt-1" style={{ color: colors.textSecondary }}>Places to Visit</Text>
                  </View>
                )}
                
                {location.holyPlaces && location.holyPlaces.length > 0 && (
                  <View className="w-[48%] mb-3 p-4 rounded-xl items-center" style={{ backgroundColor: colors.cardBackground }}>
                    <Ionicons name="flower" size={SIZES.iconMedium} color="#96CEB4" />
                    <Text className="text-2xl font-bold mt-2" style={{ color: colors.textPrimary }}>{location.holyPlaces.length}</Text>
                    <Text className="text-xs text-center mt-1" style={{ color: colors.textSecondary }}>Holy Places</Text>
                  </View>
                )}
                  {location.services && location.services.length > 0 && (
                  <View className="w-[48%] mb-3 p-4 rounded-xl items-center" style={{ backgroundColor: colors.cardBackground }}>
                    <Ionicons name="business" size={SIZES.iconMedium} color="#45B7D1" />
                    <Text className="text-2xl font-bold mt-2" style={{ color: colors.textPrimary }}>{location.services.length}</Text>
                    <Text className="text-xs text-center mt-1" style={{ color: colors.textSecondary }}>Services</Text>
                  </View>
                )}              </View>
                <View className="flex-row items-start p-3 rounded-lg mt-2" style={{ backgroundColor: colors.cardBackground }}>
                <Ionicons name="information-circle" size={SIZES.iconSmall} color={colors.primary} />
                <Text className="flex-1 text-xs ml-2" style={{ color: colors.textSecondary }}>
                  Data powered by multiple live APIs including NewsData.io, OpenTripMap, Foursquare, and more
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationDetailScreen;
