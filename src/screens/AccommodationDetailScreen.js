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
  },  accommodationCard: {
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
  accommodationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  accommodationInfo: {
    flex: 1,
  },
  accommodationName: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SIZES.xs,
  },
  typeContainer: {
    alignSelf: 'flex-start',
  },  accommodationType: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xxs,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  accommodationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xxs,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    borderColor: colors.warning + '40',
  },
  rating: {
    fontSize: SIZES.caption,
    color: colors.warning,
    marginLeft: SIZES.xxs,
    fontWeight: '600',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  address: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginLeft: SIZES.xs,
    flex: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.xs,
    marginBottom: SIZES.sm,
  },  amenityTag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xxs,
    borderRadius: SIZES.radiusSmall,
    marginRight: SIZES.xs,
    marginBottom: SIZES.xs,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  amenityText: {
    fontSize: SIZES.caption,
    color: colors.primary,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  distance: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginLeft: SIZES.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  priceLabel: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginRight: SIZES.xs,
  },
  priceRange: {
    fontSize: SIZES.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  source: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
    paddingHorizontal: SIZES.lg,
  },
  emptyStateTitle: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  emptyStateText: {
    fontSize: SIZES.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SIZES.lg,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMedium,
  },
  searchButtonText: {
    fontSize: SIZES.body,
    color: colors.textWhite,
    fontWeight: '600',
  },
});

const AccommodationDetailScreen = ({ navigation, route }) => {
  const { accommodation = [], location } = route.params || {};
  const { colors, isDarkMode } = useAppTheme();

  // Create dynamic styles based on current theme
  const styles = createStyles(colors, isDarkMode);

  const renderAccommodationItem = ({ item, index }) => (
    <View style={styles.accommodationCard}>
      <View style={styles.accommodationHeader}>
        <View style={styles.accommodationInfo}>
          <Text style={styles.accommodationName}>{item.name}</Text>
          <View style={styles.typeContainer}>
            <Text style={styles.accommodationType}>{item.type || 'Hotel'}</Text>
          </View>
        </View>
        <View style={styles.accommodationMeta}>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          )}
          <Ionicons name="bed-outline" size={20} color={colors.primary} />
        </View>
      </View>
      
      {item.address && (
        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.address}>{item.address}</Text>
        </View>
      )}
      
      {item.amenities && item.amenities.length > 0 && (
        <View style={styles.amenitiesContainer}>
          {item.amenities.slice(0, 3).map((amenity, amenityIndex) => (
            <View key={amenityIndex} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      )}
      
      {item.distance && (
        <View style={styles.distanceContainer}>
          <Ionicons name="walk-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.distance}>{Math.round(item.distance)}m away</Text>
        </View>
      )}
      
      {item.priceRange && (
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price Range:</Text>
          <Text style={styles.priceRange}>{item.priceRange}</Text>
        </View>
      )}
      
      <Text style={styles.source}>Source: {item.source}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="bed-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyStateTitle}>No Accommodation Found</Text>
      <Text style={styles.emptyStateText}>
        We couldn't find any hotels or accommodation options in this area. 
        Try searching for nearby cities or check back later.
      </Text>
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.searchButtonText}>Search Other Locations</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerTitle}>Accommodation</Text>
        <View style={styles.headerRight}>
          <Ionicons name="bed" size={24} color={colors.textWhite} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{accommodation.length}</Text>
            <Text style={styles.statLabel}>Hotels Found</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {accommodation.filter(item => item.rating && item.rating >= 4).length}
            </Text>
            <Text style={styles.statLabel}>Highly Rated</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {accommodation.filter(item => item.type?.toLowerCase().includes('luxury')).length}
            </Text>
            <Text style={styles.statLabel}>Luxury Options</Text>
          </View>
        </View>

        {accommodation.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Accommodation</Text>
              <Text style={styles.sectionSubtitle}>Hotels, resorts, and lodging options</Text>
            </View>
            
            <FlatList
              data={accommodation}
              renderItem={renderAccommodationItem}
              keyExtractor={(item, index) => `accommodation-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccommodationDetailScreen;
