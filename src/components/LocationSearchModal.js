import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';
import { LocationService } from '../services/LocationService';

const LocationSearchModal = ({ visible, onClose, onLocationSelect }) => {
  const { colors, isDarkMode } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create dynamic styles based on current theme
  const styles = createStyles(colors, isDarkMode);
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Please enter a location to search');
      return;
    }

    setIsLoading(true);
    try {
      const results = await LocationService.searchLocations(searchQuery.trim());
      
      if (results.length === 0) {
        Alert.alert('No results found', 'Please try searching for a different location');
        setSearchResults([]);
      } else {
        // Get location details for each result
        const detailedResults = await Promise.all(
          results.slice(0, 5).map(async (result) => {
            const details = await LocationService.getLocationDetails(
              result.latitude,
              result.longitude
            );
            return details || {
              name: result.name?.split(',')[0] || 'Unknown Location',
              formattedAddress: result.formattedAddress || `${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`,
              coordinates: { latitude: result.latitude, longitude: result.longitude },
              region: result.name?.split(',')[1]?.trim() || 'Unknown Region',
              country: result.name?.split(',').slice(-1)[0]?.trim() || 'Unknown Country'
            };
          })
        );
        setSearchResults(detailedResults.filter(Boolean));
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to search for locations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleLocationSelect = (location) => {
    onLocationSelect(location);
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };
  const handleUseCurrentLocation = async () => {
    try {
      // Request location permission
      const hasPermission = await LocationService.requestLocationPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions to use your current location.',
          [{ text: 'OK' }]
        );
        return;
      }

      setIsLoading(true);
      
      // Get current location
      const currentLocation = await LocationService.getCurrentLocation();
      
      if (!currentLocation) {
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please try again or search manually.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get location details
      const locationDetails = await LocationService.getLocationDetails(
        currentLocation.latitude,
        currentLocation.longitude
      );

      if (locationDetails) {
        handleLocationSelect(locationDetails);
      } else {
        Alert.alert(
          'Location Error',
          'Unable to get details for your current location. Please try searching manually.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Current location error:', error);
      Alert.alert(
        'Location Error',
        'Failed to get your current location. Please try again or search manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopularCitySelect = async (cityName, countryName) => {
    const query = `${cityName}, ${countryName}`;
    setSearchQuery(query);
    
    setIsLoading(true);
    try {
      const results = await LocationService.searchLocations(query);
      
      if (results.length === 0) {
        Alert.alert('No results found', 'Please try searching for a different location');
        setSearchResults([]);
      } else {
        // Get location details for the first result (most relevant)
        const locationDetails = await LocationService.getLocationDetails(
          results[0].latitude,
          results[0].longitude
        );
        
        if (locationDetails) {
          handleLocationSelect(locationDetails);
        } else {
          Alert.alert('Location Error', 'Unable to get details for this location.');
        }
      }
    } catch (error) {
      console.error('Popular city search error:', error);
      Alert.alert('Search Error', 'Failed to search for this location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.locationIcon}>
        <Ionicons name="location" size={SIZES.iconMedium} color={colors.primary} />
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.formattedAddress}</Text>
        {item.hasWikipediaData && (
          <View style={styles.wikipediaBadge}>
            <Ionicons name="library" size={SIZES.iconSmall} color={colors.primary} />
            <Text style={styles.wikipediaBadgeText}>Wikipedia</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={SIZES.iconSmall} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={SIZES.iconLarge} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Location</Text>
          <View style={styles.placeholder} />
        </View>{/* Search Input */}        <View style={styles.searchContainer}>
          {/* Use Current Location Button */}
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={handleUseCurrentLocation}
          >            <View style={styles.currentLocationContent}>
              <Ionicons name="location" size={SIZES.iconMedium} color={colors.primary} />
              <Text style={styles.currentLocationText}>Use Current Location</Text>
            </View>
            <Ionicons name="chevron-forward" size={SIZES.iconSmall} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.searchInputRow}>
            <View style={styles.searchInputContainer}>              <Ionicons name="search" size={SIZES.iconMedium} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter city, country, or landmark..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={SIZES.iconMedium} color={colors.textSecondary} />
                </TouchableOpacity>
              )}</View>
              <TouchableOpacity onPress={handleSearch} disabled={isLoading}>
              <LinearGradient
                colors={isDarkMode ? [colors.gradientStart, colors.gradientEnd] : [COLORS.gradientStart, COLORS.gradientEnd]}
                style={styles.searchButton}
              >
                <Text style={styles.searchButtonText}>
                  {isLoading ? 'Searching...' : 'Search'}
                </Text>
              </LinearGradient>
            </TouchableOpacity></View>
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Search Results</Text>            <FlatList
              data={searchResults}
              renderItem={renderLocationItem}
              keyExtractor={(item, index) => `search-result-${index}-${item.coordinates?.latitude || 0}-${item.coordinates?.longitude || 0}`}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Popular Locations */}
        <View style={styles.popularContainer}>
          <Text style={styles.popularTitle}>Popular Destinations</Text>          <View style={styles.popularGrid}>            {[
              { name: 'New York', country: 'USA' },
              { name: 'London', country: 'UK' },
              { name: 'Singapore', country: 'Singapore' },
              { name: 'Sydney', country: 'Australia' },
              { name: 'Paris', country: 'France' },
              { name: 'Dubai', country: 'UAE' },].map((city, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularItem}
                onPress={() => handlePopularCitySelect(city.name, city.country)}
              >
                <Text style={styles.popularItemText}>{city.name}</Text>
                <Text style={styles.popularItemCountry}>{city.country}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: SIZES.sm,
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholder: {
    width: SIZES.iconLarge + SIZES.sm * 2,
  },
  searchContainer: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationText: {
    fontSize: SIZES.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: SIZES.sm,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.md,
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    fontSize: SIZES.body,
    color: colors.textPrimary,
  },
  searchButton: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMedium,
  },
  searchButtonText: {
    color: colors.textWhite,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: SIZES.md,
  },
  resultsTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SIZES.md,
  },  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    backgroundColor: colors.cardBackground,
    marginBottom: SIZES.sm,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SIZES.xs,
  },
  locationAddress: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
  },
  wikipediaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  wikipediaBadgeText: {
    fontSize: SIZES.small,
    color: colors.primary,
    marginLeft: SIZES.xs,
    fontWeight: '500',
  },
  popularContainer: {
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.lg,
  },
  popularTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SIZES.md,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },  popularItem: {
    width: '48%',
    backgroundColor: colors.cardBackground,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.2 : 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  popularItemText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  popularItemCountry: {
    fontSize: SIZES.caption,
    color: colors.textSecondary,
    marginTop: SIZES.xs,
  },
});

export default LocationSearchModal;
