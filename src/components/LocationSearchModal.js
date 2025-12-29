import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';
import { LocationService } from '../services/LocationService';

const LocationSearchModal = ({ visible, onClose, onLocationSelect }) => {
  const { colors, isDarkMode } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      className="flex-row items-center py-3 px-2 rounded-lg border mb-2"
      style={{ 
        backgroundColor: colors.cardBackground, 
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.3 : 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
      onPress={() => handleLocationSelect(item)}
    >
      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" 
        style={{ backgroundColor: colors.secondary + '20' }}
      >
        <Ionicons name="location" size={24} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
          {item.name}
        </Text>
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          {item.formattedAddress}
        </Text>
        {item.hasWikipediaData && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="library" size={14} color={colors.primary} />
            <Text className="text-xs font-medium ml-1" style={{ color: colors.primary }}>
              Wikipedia
            </Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-2 border-b" 
          style={{ borderBottomColor: colors.border }}
        >
          <TouchableOpacity className="p-2" onPress={onClose}>
            <Ionicons name="close" size={32} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            Search Location
          </Text>
          <View className="w-12" />
        </View>

        {/* Search Input */}
        <View className="px-4 py-6">
          {/* Use Current Location Button */}
          <TouchableOpacity 
            className="flex-row items-center justify-between rounded-lg px-4 py-3 mb-3 border"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.3 : 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={handleUseCurrentLocation}
          >
            <View className="flex-row items-center">
              <Ionicons name="location" size={24} color={colors.primary} />
              <Text className="text-base font-semibold ml-2" style={{ color: colors.textPrimary }}>
                Use Current Location
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View className="flex-row items-center">
            <View className="flex-1 flex-row items-center rounded-lg px-3 mr-2 border" 
              style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
            >
              <Ionicons name="search" size={24} color={colors.textSecondary} />
              <TextInput
                className="flex-1 py-3 px-2 text-base"
                style={{ color: colors.textPrimary }}
                placeholder="Enter city, country, or landmark..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={handleSearch} disabled={isLoading}>
              <LinearGradient
                colors={isDarkMode ? [colors.gradientStart, colors.gradientEnd] : [COLORS.gradientStart, COLORS.gradientEnd]}
                className="px-6 py-3 rounded-lg"
              >
                <Text className="text-base font-semibold" style={{ color: colors.textWhite }}>
                  {isLoading ? 'Searching...' : 'Search'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View className="flex-1 px-4">
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Search Results
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderLocationItem}
              keyExtractor={(item, index) => `search-result-${index}-${item.coordinates?.latitude || 0}-${item.coordinates?.longitude || 0}`}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Popular Locations */}
        <View className="px-4 pb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Popular Destinations
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {[
              { name: 'New York', country: 'USA' },
              { name: 'London', country: 'UK' },
              { name: 'Singapore', country: 'Singapore' },
              { name: 'Sydney', country: 'Australia' },
              { name: 'Paris', country: 'France' },
              { name: 'Dubai', country: 'UAE' },
            ].map((city, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] py-3 px-2 rounded-lg mb-2 items-center border"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isDarkMode ? 0.2 : 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
                onPress={() => handlePopularCitySelect(city.name, city.country)}
              >
                <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  {city.name}
                </Text>
                <Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                  {city.country}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LocationSearchModal;
