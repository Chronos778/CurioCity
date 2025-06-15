import React from 'react';
import {
  View,
  Text,
  StyleSheet,
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
  
  // Create dynamic styles based on current theme
  const styles = createStyles(colors, isDarkMode);
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {location.name}
        </Text>
        <View style={styles.headerRight}>
          <Ionicons name="information-circle" size={24} color={colors.textWhite} />
        </View></LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Location Image - Only show if available */}
        {location.thumbnail && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: location.thumbnail }}
              style={styles.locationImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Content Sections */}
        <View style={styles.contentContainer}>{/* About Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About {location.name}</Text>
              {location.wikipediaUrl && (
                <TouchableOpacity 
                  style={styles.wikipediaButton}
                  onPress={handleWikipediaLink}
                >
                  <Ionicons name="open-outline" size={SIZES.iconSmall} color={COLORS.primary} />
                  <Text style={styles.wikipediaButtonText}>Wikipedia</Text>
                </TouchableOpacity>
              )}
            </View>            <Text style={styles.sectionContent}>
              {location.fullDescription || location.description}
            </Text>
          </View>

          {/* Quick Facts Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Facts</Text>
            <View style={styles.factsList}>
              <View style={styles.factItem}>
                <Ionicons name="flag" size={SIZES.iconMedium} color={COLORS.primary} />
                <View style={styles.factContent}>
                  <Text style={styles.factLabel}>Country</Text>
                  <Text style={styles.factValue}>{location.country}</Text>
                </View>
              </View>
              
              <View style={styles.factItem}>
                <Ionicons name="map" size={SIZES.iconMedium} color={COLORS.primary} />
                <View style={styles.factContent}>
                  <Text style={styles.factLabel}>Region</Text>
                  <Text style={styles.factValue}>{location.region}</Text>
                </View>
              </View>
              
              <View style={styles.factItem}>
                <Ionicons name="navigate" size={SIZES.iconMedium} color={COLORS.primary} />
                <View style={styles.factContent}>
                  <Text style={styles.factLabel}>Coordinates</Text>                  <Text style={styles.factValue} numberOfLines={1} ellipsizeMode="tail">
                    {location.coordinates.latitude.toFixed(3)}, {location.coordinates.longitude.toFixed(3)}
                  </Text>
                </View>
              </View>
              
              {location.hasRealData && (
                <View style={styles.factItem}>
                  <Ionicons name="time" size={SIZES.iconMedium} color={COLORS.primary} />
                  <View style={styles.factContent}>
                    <Text style={styles.factLabel}>Data Updated</Text>
                    <Text style={styles.factValue}>
                      {new Date(location.lastUpdated).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              )}
            </View>          </View>
          
          {/* Real Data Summary */}
          {location.hasRealData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Live Data Summary</Text>
              <View style={styles.summaryGrid}>
                {location.news && location.news.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="newspaper" size={SIZES.iconMedium} color="#FFEAA7" />
                    <Text style={styles.summaryCount}>{location.news.length}</Text>
                    <Text style={styles.summaryLabel}>News Articles</Text>
                  </View>
                )}
                
                {location.restaurants && location.restaurants.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="restaurant" size={SIZES.iconMedium} color="#4ECDC4" />
                    <Text style={styles.summaryCount}>{location.restaurants.length}</Text>
                    <Text style={styles.summaryLabel}>Restaurants</Text>
                  </View>
                )}
                
                {location.placesToVisit && location.placesToVisit.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="camera" size={SIZES.iconMedium} color="#FF6B6B" />
                    <Text style={styles.summaryCount}>{location.placesToVisit.length}</Text>
                    <Text style={styles.summaryLabel}>Places to Visit</Text>
                  </View>
                )}
                
                {location.holyPlaces && location.holyPlaces.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="flower" size={SIZES.iconMedium} color="#96CEB4" />
                    <Text style={styles.summaryCount}>{location.holyPlaces.length}</Text>
                    <Text style={styles.summaryLabel}>Holy Places</Text>
                  </View>
                )}
                  {location.services && location.services.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="business" size={SIZES.iconMedium} color="#45B7D1" />
                    <Text style={styles.summaryCount}>{location.services.length}</Text>
                    <Text style={styles.summaryLabel}>Services</Text>
                  </View>
                )}              </View>
                <View style={styles.dataSourceNote}>
                <Ionicons name="information-circle" size={SIZES.iconSmall} color={colors.primary} />
                <Text style={styles.dataSourceText}>
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
    flex: 1,
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: colors.textWhite,
    textAlign: 'center',
    marginHorizontal: SIZES.sm,
  },
  headerRight: {
    padding: SIZES.sm,
  },
  imageContainer: {
    marginHorizontal: SIZES.md,
    marginTop: SIZES.lg,
    borderRadius: SIZES.radiusMedium,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.3 : 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  locationImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.lightBackground,
  },
  contentContainer: {
    paddingHorizontal: SIZES.md,
  },
  section: {
    marginVertical: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  wikipediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  wikipediaButtonText: {
    fontSize: SIZES.caption,
    color: colors.primary,
    marginLeft: SIZES.xs,
    fontWeight: '600',
  },
  sectionContent: {
    fontSize: SIZES.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  factsList: {
    backgroundColor: colors.cardBackground,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.sm,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  factContent: {
    marginLeft: SIZES.md,
    flex: 1,
  },
  factLabel: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginBottom: SIZES.xs,
  },
  factValue: {
    fontSize: SIZES.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  summaryItem: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    minWidth: '30%',
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryCount: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: SIZES.xs,
  },
  summaryLabel: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.xs,
  },
  dataSourceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.cardBackground,
    padding: SIZES.md,
    borderRadius: SIZES.radiusSmall,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: colors.border,
  },
  dataSourceText: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginLeft: SIZES.sm,
    flex: 1,
    lineHeight: 18,
  },
});

export default LocationDetailScreen;
