import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';

const HistoryDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
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
        <Text className="flex-1 text-lg font-semibold text-center" style={{ color: colors.textWhite }}>History & Culture</Text>
        <View className="p-2">
          <Ionicons name="library" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View className="flex-row mx-4 my-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {location.history ? Math.floor(location.history.length / 100) : 0}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>History Facts</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {location.establishedYear || 'Ancient'}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Founded</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {location.culturalSites || 5}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Heritage Sites</Text>
          </View>
        </View>

        {/* Main History Content */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="time" size={SIZES.iconMedium} color={colors.primary} />
            <Text className="text-xl font-bold ml-2" style={{ color: colors.textPrimary }}>Historical Overview</Text>
          </View>
          
          <View className="p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
            {location.history ? (
              <Text className="text-base leading-6" style={{ color: colors.textSecondary }}>{location.history}</Text>
            ) : (
              <Text className="text-base leading-6" style={{ color: colors.textSecondary }}>
                Historical information for {location.name} is being gathered. 
                This location has a rich heritage that spans many centuries, 
                with unique cultural significance and historical importance.
              </Text>
            )}
          </View>
        </View>

        {/* Cultural Significance */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="color-palette" size={SIZES.iconMedium} color={colors.accent} />
            <Text className="text-xl font-bold ml-2" style={{ color: colors.textPrimary }}>Cultural Significance</Text>
          </View>
          
          <View className="p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
            <Text className="text-base leading-6" style={{ color: colors.textSecondary }}>
              {location.name} holds deep cultural significance in the region of {location.region}, {location.country}. 
              The area has been shaped by various influences throughout history, creating a unique blend of traditions, 
              architecture, and local customs that continue to thrive today.
            </Text>
          </View>
        </View>

        {/* Key Facts */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={SIZES.iconMedium} color="#45B7D1" />
            <Text className="text-xl font-bold ml-2" style={{ color: colors.textPrimary }}>Key Historical Facts</Text>
          </View>
          
          <View className="gap-3">
            <View className="flex-row items-start p-3 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
              <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: '#45B7D120' }}>
                <Ionicons name="location" size={SIZES.iconSmall} color="#45B7D1" />
              </View>              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>Location</Text>                <Text className="text-xs leading-5" numberOfLines={2} ellipsizeMode="tail" style={{ color: colors.textSecondary }}>
                  {location.coordinates?.latitude && location.coordinates?.longitude 
                    ? `Situated at ${location.coordinates.latitude.toFixed(3)}°, ${location.coordinates.longitude.toFixed(3)}°`
                    : `Located in ${location.region || 'the region'}, ${location.country || 'the area'}`
                  }
                </Text>
              </View>
            </View>

            <View className="flex-row items-start p-3 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
              <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: '#45B7D120' }}>
                <Ionicons name="flag" size={SIZES.iconSmall} color="#45B7D1" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>Region</Text>
                <Text className="text-xs leading-5" style={{ color: colors.textSecondary }}>
                  Part of {location.region}, {location.country}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start p-3 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
              <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: '#45B7D120' }}>
                <Ionicons name="globe" size={SIZES.iconSmall} color="#45B7D1" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>Cultural Heritage</Text>
                <Text className="text-xs leading-5" style={{ color: colors.textSecondary }}>
                  Rich blend of local traditions and historical influences
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Sources */}
        {location.hasRealData && (
          <View className="mx-4 mb-6 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
            <View className="flex-row items-center mb-2">
              <Ionicons name="library" size={SIZES.iconSmall} color={colors.textSecondary} />
              <Text className="text-sm font-semibold ml-2" style={{ color: colors.textPrimary }}>Content Sources</Text>
            </View>
            <Text className="text-xs leading-5" style={{ color: colors.textSecondary }}>
              Historical information powered by Google Gemini AI and Wikipedia. 
              Content is generated based on available historical data and cultural research.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default HistoryDetailScreen;
