import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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
  },  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: SIZES.sm,
  },  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: SIZES.sm,
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
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },  emptyDescription: {
    fontSize: SIZES.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  historySection: {
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.lg,
  },  contentCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyText: {
    fontSize: SIZES.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  noHistoryText: {
    fontSize: SIZES.body,
    color: colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  cultureText: {
    fontSize: SIZES.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },  factsContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  factIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  factContent: {
    flex: 1,
  },
  factTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SIZES.xs,
  },
  factDescription: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },  sourceSection: {
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.lg,
    backgroundColor: colors.cardBackground,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sourceTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: SIZES.sm,
  },
  sourceText: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

const HistoryDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const styles = createStyles(colors, isDarkMode);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerTitle}>History & Culture</Text>
        <View style={styles.headerRight}>
          <Ionicons name="library" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {location.history ? Math.floor(location.history.length / 100) : 0}
            </Text>
            <Text style={styles.statLabel}>History Facts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {location.establishedYear || 'Ancient'}
            </Text>
            <Text style={styles.statLabel}>Founded</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {location.culturalSites || 5}
            </Text>
            <Text style={styles.statLabel}>Heritage Sites</Text>
          </View>
        </View>

        {/* Main History Content */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={SIZES.iconMedium} color={colors.primary} />
            <Text style={styles.sectionTitle}>Historical Overview</Text>
          </View>
          
          <View style={styles.contentCard}>
            {location.history ? (
              <Text style={styles.historyText}>{location.history}</Text>
            ) : (
              <Text style={styles.noHistoryText}>
                Historical information for {location.name} is being gathered. 
                This location has a rich heritage that spans many centuries, 
                with unique cultural significance and historical importance.
              </Text>
            )}
          </View>
        </View>

        {/* Cultural Significance */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette" size={SIZES.iconMedium} color={colors.accent} />
            <Text style={styles.sectionTitle}>Cultural Significance</Text>
          </View>
          
          <View style={styles.contentCard}>
            <Text style={styles.cultureText}>
              {location.name} holds deep cultural significance in the region of {location.region}, {location.country}. 
              The area has been shaped by various influences throughout history, creating a unique blend of traditions, 
              architecture, and local customs that continue to thrive today.
            </Text>
          </View>
        </View>

        {/* Key Facts */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={SIZES.iconMedium} color="#45B7D1" />
            <Text style={styles.sectionTitle}>Key Historical Facts</Text>
          </View>
          
          <View style={styles.factsContainer}>
            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Ionicons name="location" size={SIZES.iconSmall} color="#45B7D1" />
              </View>              <View style={styles.factContent}>
                <Text style={styles.factTitle}>Location</Text>                <Text style={styles.factDescription} numberOfLines={2} ellipsizeMode="tail">
                  {location.coordinates?.latitude && location.coordinates?.longitude 
                    ? `Situated at ${location.coordinates.latitude.toFixed(3)}°, ${location.coordinates.longitude.toFixed(3)}°`
                    : `Located in ${location.region || 'the region'}, ${location.country || 'the area'}`
                  }
                </Text>
              </View>
            </View>

            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Ionicons name="flag" size={SIZES.iconSmall} color="#45B7D1" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factTitle}>Region</Text>
                <Text style={styles.factDescription}>
                  Part of {location.region}, {location.country}
                </Text>
              </View>
            </View>

            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Ionicons name="globe" size={SIZES.iconSmall} color="#45B7D1" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factTitle}>Cultural Heritage</Text>
                <Text style={styles.factDescription}>
                  Rich blend of local traditions and historical influences
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Sources */}
        {location.hasRealData && (
          <View style={styles.sourceSection}>
            <View style={styles.sourceHeader}>
              <Ionicons name="library" size={SIZES.iconSmall} color={colors.textSecondary} />
              <Text style={styles.sourceTitle}>Content Sources</Text>
            </View>
            <Text style={styles.sourceText}>
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
