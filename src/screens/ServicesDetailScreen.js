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

const ServicesDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const services = location.services || [];
  const { colors, isDarkMode } = useAppTheme();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance > 1000 ? `${(distance / 1000).toFixed(1)}km` : `${Math.round(distance)}m`;
  };

  const getServiceIcon = (type) => {
    if (!type) return 'business';
    const serviceType = type.toLowerCase();
    if (serviceType.includes('hospital') || serviceType.includes('medical')) return 'medical';
    if (serviceType.includes('bank') || serviceType.includes('atm')) return 'card';
    if (serviceType.includes('hotel') || serviceType.includes('accommodation')) return 'bed';
    if (serviceType.includes('shop') || serviceType.includes('store')) return 'storefront';
    if (serviceType.includes('transport') || serviceType.includes('station')) return 'train';
    if (serviceType.includes('fuel') || serviceType.includes('gas')) return 'car';
    if (serviceType.includes('pharmacy')) return 'medical';
    if (serviceType.includes('post')) return 'mail';
    return 'business';
  };

  const formatServiceType = (type) => {
    if (!type) return 'Service';
    return type.split(',').map(t => 
      t.trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).slice(0, 2).join(', ');
  };

  const getServiceColor = (type) => {
    if (!type) return '#45B7D1';
    const serviceType = type.toLowerCase();
    if (serviceType.includes('hospital') || serviceType.includes('medical')) return '#e74c3c';
    if (serviceType.includes('bank')) return '#f39c12';
    if (serviceType.includes('hotel')) return '#9b59b6';
    if (serviceType.includes('shop')) return '#2ecc71';
    return '#45B7D1';
  };

  const renderServiceItem = ({ item: service, index }) => (
    <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: getServiceColor(service.type) + '20' }}>
          <Ionicons 
            name={getServiceIcon(service.type)} 
            size={SIZES.iconMedium} 
            color={getServiceColor(service.type)} 
          />
        </View>
        <View className="flex-1 mx-3">
          <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>{service.name}</Text>
          <Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>{formatServiceType(service.type)}</Text>
        </View>
        {service.distance && (
          <View className="flex-row items-center">
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.primary} />
            <Text className="text-xs ml-1" style={{ color: colors.primary }}>{formatDistance(service.distance)}</Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center">
        <Ionicons name="navigate" size={SIZES.iconSmall} color={colors.textSecondary} />
        <Text className="flex-1 text-xs ml-2" numberOfLines={1} ellipsizeMode="tail" style={{ color: colors.textSecondary }}>
          {service.coordinates?.latitude?.toFixed(3) || '0.000'}, {service.coordinates?.longitude?.toFixed(3) || '0.000'}
        </Text>
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
        <Text className="flex-1 text-lg font-semibold text-center" style={{ color: colors.textWhite }}>Services & Amenities</Text>
        <View className="p-2">
          <Ionicons name="business" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View className="flex-row mx-4 my-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{services.length}</Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Total Services</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {new Set(services.map(s => s.type?.split(',')[0]?.trim())).size}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Service Types</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {services.filter(s => s.distance && s.distance <= 1000).length}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Within 1km</Text>
          </View>
        </View>

        {services.length > 0 ? (
          <>
            <View className="px-4 mb-3">
              <Text className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>Available Services</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>Services and amenities in {location.name}</Text>
            </View>
            
            <View className="px-4">
            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={(item, index) => `service-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center px-8 py-16">
            <Ionicons name="business-outline" size={60} color={colors.textSecondary} />
            <Text className="text-xl font-bold mt-4 text-center" style={{ color: colors.textPrimary }}>No Services Found</Text>
            <Text className="text-sm mt-2 text-center" style={{ color: colors.textSecondary }}>
              We couldn't find any services and amenities for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default ServicesDetailScreen;
