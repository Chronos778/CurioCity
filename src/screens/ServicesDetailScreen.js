import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';

// Create dynamic styles function that responds to theme
const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    paddingTop: SIZES.xl,
  },
  backButton: {
    padding: SIZES.sm,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: colors.textWhite,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    padding: SIZES.sm,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    marginHorizontal: SIZES.md,
    marginTop: SIZES.md,
    borderRadius: SIZES.radiusMedium,
    paddingVertical: SIZES.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginTop: SIZES.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: SIZES.sm,
  },
  sectionHeader: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: SIZES.body,
    color: colors.textSecondary,
    marginTop: SIZES.xs,
  },
  itemCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.md,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SIZES.xs,
  },
  itemDescription: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginBottom: SIZES.xs,
  },
  itemDetails: {
    marginTop: SIZES.sm,
  },
  distanceText: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
    paddingHorizontal: SIZES.lg,
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  emptyDescription: {
    fontSize: SIZES.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSmall,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coordinatesText: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginLeft: SIZES.xs,
    flex: 1,
  },
});

const ServicesDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const services = location.services || [];
  const { colors, isDarkMode } = useAppTheme();

  // Create dynamic styles based on current theme
  const styles = createStyles(colors, isDarkMode);

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
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={[styles.serviceIconContainer, { backgroundColor: getServiceColor(service.type) + '20' }]}>
          <Ionicons 
            name={getServiceIcon(service.type)} 
            size={SIZES.iconMedium} 
            color={getServiceColor(service.type)} 
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{service.name}</Text>
          <Text style={styles.itemDescription}>{formatServiceType(service.type)}</Text>
        </View>
        {service.distance && (
          <View style={styles.distanceContainer}>
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.primary} />
            <Text style={styles.distanceText}>{formatDistance(service.distance)}</Text>
          </View>
        )}
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.coordinatesContainer}>
          <Ionicons name="navigate" size={SIZES.iconSmall} color={colors.textSecondary} />
          <Text style={styles.coordinatesText} numberOfLines={1} ellipsizeMode="tail">
            {service.coordinates?.latitude?.toFixed(3) || '0.000'}, {service.coordinates?.longitude?.toFixed(3) || '0.000'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services & Amenities</Text>
        <View style={styles.headerRight}>
          <Ionicons name="business" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{services.length}</Text>
            <Text style={styles.statLabel}>Total Services</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Set(services.map(s => s.type?.split(',')[0]?.trim())).size}
            </Text>
            <Text style={styles.statLabel}>Service Types</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {services.filter(s => s.distance && s.distance <= 1000).length}
            </Text>
            <Text style={styles.statLabel}>Within 1km</Text>
          </View>
        </View>

        {services.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Services</Text>
              <Text style={styles.sectionSubtitle}>Services and amenities in {location.name}</Text>
            </View>
            
            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={(item, index) => `service-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={60} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Services Found</Text>
            <Text style={styles.emptyDescription}>
              We couldn't find any services and amenities for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default ServicesDetailScreen;
