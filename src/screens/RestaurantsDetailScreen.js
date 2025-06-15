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

const RestaurantsDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const restaurants = location.restaurants || [];

  // Create dynamic styles based on current theme
  const styles = createStyles(colors, isDarkMode);

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
    <View style={styles.restaurantCard}>
      <View style={styles.restaurantHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          {restaurant.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStars}>{getRatingStars(restaurant.rating)}</Text>
              <Text style={styles.ratingValue}>({restaurant.rating})</Text>
            </View>
          )}
        </View>
        {restaurant.distance && (
          <View style={styles.distanceContainer}>
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.primary} />
            <Text style={styles.distanceText}>{formatDistance(restaurant.distance)}</Text>
          </View>
        )}
      </View>

      {restaurant.categories && restaurant.categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          {restaurant.categories.slice(0, 3).map((category, catIndex) => (
            <View key={catIndex} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
      )}

      {restaurant.address && (
        <View style={styles.addressContainer}>
          <Ionicons name="map" size={SIZES.iconSmall} color={colors.textSecondary} />
          <Text style={styles.addressText}>{restaurant.address}</Text>
        </View>
      )}
    </View>
  );

  return (    <SafeAreaView style={styles.container}>
      {/* Header */}      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurants</Text>
        <View style={styles.headerRight}>
          <Ionicons name="restaurant" size={24} color={colors.textWhite} />
        </View></LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{restaurants.length}</Text>
            <Text style={styles.statLabel}>Restaurants</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {restaurants.filter(restaurant => restaurant.rating && restaurant.rating >= 4).length}
            </Text>
            <Text style={styles.statLabel}>Highly Rated</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {restaurants.filter(restaurant => restaurant.categories?.some(cat => cat.toLowerCase().includes('fine'))).length}
            </Text>
            <Text style={styles.statLabel}>Fine Dining</Text>
          </View>
        </View>        {restaurants.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Local Restaurants</Text>
              <Text style={styles.sectionSubtitle}>Dining options and culinary experiences in {location.name}</Text>
            </View>
            
            <FlatList
              data={restaurants}
              renderItem={renderRestaurantItem}
              keyExtractor={(item, index) => `restaurant-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (<View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={60} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Restaurants Found</Text>
            <Text style={styles.emptyDescription}>
              We couldn't find any restaurants for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  },  statsContainer: {
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
  },  restaurantCard: {
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
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SIZES.xs,
  },
  restaurantCategories: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginBottom: SIZES.xs,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.sm,
  },  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    fontSize: SIZES.caption,
    color: colors.accent,
    marginRight: SIZES.xs,
  },
  ratingValue: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  ratingText: {
    fontSize: SIZES.caption,
    color: colors.primary,
    marginLeft: SIZES.xs,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.sm,
  },  categoryTag: {
    backgroundColor: colors.primary + '20',
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    marginRight: SIZES.xs,
    marginBottom: SIZES.xs,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  categoryText: {
    fontSize: SIZES.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  addressText: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginLeft: SIZES.xs,
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginLeft: SIZES.xs,
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
});

export default RestaurantsDetailScreen;
