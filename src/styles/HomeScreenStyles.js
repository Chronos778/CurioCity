import { StyleSheet, Dimensions } from 'react-native';
import { SIZES } from '../constants/colors';
import { createCommonStyles } from './commonStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Creates HomeScreen-specific styles for the new wireframe layout.
 * Premium minimal design without gradients.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} StyleSheet for HomeScreen
 */
export const createHomeScreenStyles = (colors, isDarkMode) => {
  const common = createCommonStyles(colors, isDarkMode);
  
  // Card dimensions - carousel style with center focus
  const CARD_PEEK = 40; // How much of adjacent cards peek from sides
  const CARD_GAP = SIZES.md;
  const PLACE_CARD_WIDTH = SCREEN_WIDTH - (CARD_PEEK * 2) - (CARD_GAP * 2);
  const RESTAURANT_CARD_WIDTH = SCREEN_WIDTH - (CARD_PEEK * 2) - (CARD_GAP * 2);
  const HOTEL_CARD_WIDTH = (SCREEN_WIDTH - SIZES.md * 3) / 2;
  const HOLY_PLACE_CARD_WIDTH = SCREEN_WIDTH - (CARD_PEEK * 2) - (CARD_GAP * 2);
  const NEWS_CARD_WIDTH = SCREEN_WIDTH - SIZES.md * 2;

  return StyleSheet.create({
    // Base container
    ...common.container(),

    // Loading states
    ...common.loading(),

    // ============ COMPACT HEADER ============
    compactHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.md,
      paddingTop: SIZES.lg,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerCityButton: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    cityName: {
      fontSize: SIZES.h3,
      fontWeight: '700',
      color: colors.textPrimary,
      marginLeft: SIZES.sm,
    },
    themeToggle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },

    // ============ CITY INFO CARD ============
    cityInfoCard: {
      marginHorizontal: SIZES.md,
      marginTop: SIZES.md,
      marginBottom: SIZES.lg,
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusLarge,
      borderWidth: 1,
      borderColor: colors.border,
      padding: SIZES.lg,
      // Shadow for depth
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.4 : 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    cityDescription: {
      fontSize: SIZES.body,
      color: colors.textSecondary,
      lineHeight: SIZES.body * 1.6,
      marginBottom: SIZES.lg,
    },
    cityInfoActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    readMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.surface : '#1a1a1a',
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.md,
      borderRadius: SIZES.radiusMedium,
    },
    readMoreText: {
      fontSize: SIZES.body,
      fontWeight: '600',
      color: '#FFFFFF',
      marginRight: SIZES.sm,
    },
    searchCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.cardBackground,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ============ CHIP ROW ============
    chipScrollView: {
      marginBottom: SIZES.lg,
      marginTop: 0,
    },
    chipScrollContent: {
      paddingHorizontal: SIZES.md,
      gap: SIZES.sm,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.sm,
      borderRadius: SIZES.radiusMedium,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: SIZES.sm,
    },
    chipIcon: {
      marginRight: SIZES.xs,
    },
    chipLabel: {
      fontSize: SIZES.caption,
      fontWeight: '600',
      color: colors.textPrimary,
    },

    // ============ SECTION CONTAINER ============
    sectionContainer: {
      marginBottom: SIZES.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SIZES.md,
      marginBottom: SIZES.md,
    },
    sectionTitle: {
      fontSize: SIZES.h4,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    viewAllText: {
      fontSize: SIZES.caption,
      fontWeight: '600',
      color: colors.primary,
    },

    // ============ SCROLL INDICATORS ============
    scrollIndicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SIZES.sm,
      height: 12,
    },
    scrollDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.border,
      marginHorizontal: 3,
    },
    scrollDotActive: {
      backgroundColor: colors.primary,
      width: 16,
    },

    // ============ HORIZONTAL LIST (Carousel Style) ============
    horizontalList: {
      // No left padding - content padding handles centering
    },
    horizontalListContent: {
      paddingHorizontal: CARD_PEEK + CARD_GAP, // Center first card with peek on left
    },

    // ============ CAROUSEL CARD BASE ============
    carouselCard: {
      width: PLACE_CARD_WIDTH,
      marginHorizontal: CARD_GAP / 2,
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusLarge,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      // Shadow for depth
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.4 : 0.15,
      shadowRadius: 8,
      elevation: 5,
    },

    // ============ PLACE CARD ============
    placeCard: {
      width: PLACE_CARD_WIDTH,
      marginHorizontal: CARD_GAP / 2,
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusLarge,
      overflow: 'hidden',
      // Shadow for depth
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.4 : 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    cardIconBox: {
      width: '100%',
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      padding: SIZES.lg,
    },
    cardName: {
      fontSize: SIZES.h4,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: SIZES.xs,
    },
    cardSubtitle: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginBottom: SIZES.sm,
    },
    cardDetailsLabel: {
      fontSize: SIZES.body,
      color: colors.primary,
      fontWeight: '600',
    },
    cardRatingBadge: {
      position: 'absolute',
      top: SIZES.md,
      right: SIZES.md,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.xs,
      borderRadius: SIZES.radiusSmall,
    },
    cardRatingText: {
      fontSize: SIZES.caption,
      fontWeight: '600',
      color: '#FFF',
      marginLeft: 4,
    },

    // ============ RESTAURANT CARD ============
    restaurantCard: {
      width: RESTAURANT_CARD_WIDTH,
      marginHorizontal: CARD_GAP / 2,
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusLarge,
      overflow: 'hidden',
      // Shadow for depth
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.4 : 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    restaurantIconBox: {
      width: '100%',
      height: 180,
      alignItems: 'center',
      justifyContent: 'center',
    },
    restaurantContent: {
      padding: SIZES.lg,
    },
    restaurantName: {
      fontSize: SIZES.h4,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: SIZES.xs,
    },
    restaurantCategory: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginBottom: SIZES.md,
    },
    restaurantButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    restaurantButton: {
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.xs,
      backgroundColor: colors.primary + '10',
      borderRadius: SIZES.radiusSmall,
    },
    restaurantButtonText: {
      fontSize: SIZES.small,
      color: colors.primary,
      fontWeight: '500',
    },

    // ============ ACCOMMODATION GRID (2-Column Poster Style) ============
    accommodationGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: SIZES.md,
      justifyContent: 'space-between',
    },
    accommodationCard: {
      width: HOTEL_CARD_WIDTH,
      marginBottom: SIZES.md,
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusLarge,
      overflow: 'hidden',
      // Shadow for depth
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.4 : 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    accommodationImageBox: {
      width: '100%',
      height: 180,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    accommodationBookmark: {
      position: 'absolute',
      bottom: SIZES.sm,
      right: SIZES.sm,
      width: 32,
      height: 32,
      borderRadius: 6,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    accommodationContent: {
      padding: SIZES.md,
    },
    accommodationName: {
      fontSize: SIZES.body,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: SIZES.xs,
    },
    accommodationMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    accommodationRating: {
      fontSize: SIZES.small,
      color: colors.textSecondary,
      marginRight: SIZES.xs,
    },
    accommodationDivider: {
      color: colors.textSecondary,
      marginHorizontal: 4,
    },
    accommodationType: {
      fontSize: SIZES.small,
      color: colors.textSecondary,
    },

    // ============ HOLY PLACE CARD ============
    holyPlaceCard: {
      width: HOLY_PLACE_CARD_WIDTH,
      marginHorizontal: CARD_GAP / 2,
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusLarge,
      overflow: 'hidden',
      // Shadow for depth
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.4 : 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    holyPlaceIconBox: {
      width: '100%',
      height: 220,
      alignItems: 'center',
      justifyContent: 'center',
    },
    holyPlaceContent: {
      padding: SIZES.lg,
    },
    holyPlaceName: {
      fontSize: SIZES.h4,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    holyPlaceType: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginTop: SIZES.xs,
      textTransform: 'capitalize',
    },

    // ============ SERVICE LIST CARD ============
    serviceListCard: {
      marginHorizontal: SIZES.md,
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusMedium,
      borderWidth: 1,
      borderColor: colors.border,
      height: 220,
      overflow: 'hidden',
    },
    serviceScrollView: {
      flex: 1,
    },
    serviceScrollContent: {
      padding: SIZES.md,
    },
    serviceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SIZES.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    serviceRowLast: {
      borderBottomWidth: 0,
    },
    serviceIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SIZES.sm,
    },
    serviceInfo: {
      flex: 1,
    },
    serviceName: {
      fontSize: SIZES.body,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    serviceLink: {
      fontSize: SIZES.small,
      color: colors.textSecondary,
      marginTop: 2,
    },

    // ============ NEWS CONTAINER ============
    newsContainer: {
      marginHorizontal: SIZES.md,
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusMedium,
      borderWidth: 1,
      borderColor: colors.border,
      height: 300,
      overflow: 'hidden',
    },
    newsScrollView: {
      flex: 1,
    },
    newsScrollContent: {
      padding: SIZES.md,
    },
    newsCard: {
      backgroundColor: colors.cardBackground,
      marginBottom: SIZES.md,
      borderRadius: SIZES.radiusMedium,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    newsCardLast: {
      marginBottom: 0,
    },
    newsIconBox: {
      width: '100%',
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFEAA7',
    },
    newsContent: {
      padding: SIZES.md,
    },
    newsTitle: {
      fontSize: SIZES.body,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SIZES.xs,
    },
    newsDescription: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      lineHeight: SIZES.caption * 1.4,
    },
    newsPagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SIZES.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    newsDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.border,
      marginHorizontal: 3,
    },
    newsDotActive: {
      backgroundColor: colors.primary,
      width: 16,
    },

    // ============ SCROLL CONTAINER ============
    scrollContent: {
      paddingBottom: SIZES.xxl,
    },
  });
};
