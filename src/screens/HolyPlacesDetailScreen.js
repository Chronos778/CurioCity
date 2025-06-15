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
  religionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  placeType: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginTop: SIZES.xxs,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  addressText: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginLeft: SIZES.xs,
    flex: 1,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
    flex: 1,
  },
  coordinatesText: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginLeft: SIZES.xs,
    flex: 1,
  },
});

const HolyPlacesDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const holyPlaces = location.holyPlaces || [];
  const { colors, isDarkMode } = useAppTheme();

  // Create dynamic styles based on current theme
  const styles = createStyles(colors, isDarkMode);

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
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={[styles.religionIconContainer, { backgroundColor: '#96CEB420' }]}>
          <Ionicons 
            name={getReligionIcon(place.religion)} 
            size={SIZES.iconMedium} 
            color="#96CEB4" 
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{place.name}</Text>
          <Text style={styles.itemDescription}>{formatReligion(place.religion)}</Text>
          {place.type && (
            <Text style={styles.placeType}>{formatType(place.type)}</Text>
          )}
        </View>
      </View>

      <View style={styles.itemDetails}>
        {place.address && (
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.textSecondary} />
            <Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">{place.address}</Text>
          </View>
        )}

        <View style={styles.coordinatesContainer}>
          <Ionicons name="navigate" size={SIZES.iconSmall} color={colors.textSecondary} />
          <Text style={styles.coordinatesText} numberOfLines={1} ellipsizeMode="tail">
            {place.coordinates?.latitude?.toFixed(3) || '0.000'}, {place.coordinates?.longitude?.toFixed(3) || '0.000'}
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
        <Text style={styles.headerTitle}>Holy Places</Text>
        <View style={styles.headerRight}>
          <Ionicons name="flower" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{holyPlaces.length}</Text>
            <Text style={styles.statLabel}>Sacred Sites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {holyPlaces.filter(place => place.religion).length}
            </Text>
            <Text style={styles.statLabel}>Different Faiths</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {holyPlaces.filter(place => place.type).length}
            </Text>
            <Text style={styles.statLabel}>Place Types</Text>
          </View>
        </View>

        {holyPlaces.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sacred Places</Text>
              <Text style={styles.sectionSubtitle}>Places of worship and spiritual significance in {location.name}</Text>
            </View>
            
            <FlatList
              data={holyPlaces}
              renderItem={renderHolyPlaceItem}
              keyExtractor={(item, index) => `holy-place-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="flower-outline" size={60} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Holy Places Found</Text>
            <Text style={styles.emptyDescription}>
              We couldn't find any places of worship for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HolyPlacesDetailScreen;
