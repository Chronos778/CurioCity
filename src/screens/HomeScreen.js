import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';
import { LocationService } from '../services/LocationService';
import LocationSearchModal from '../components/LocationSearchModal';
import { createHomeScreenStyles } from '../styles/HomeScreenStyles';

// ============ MOCK DATA ============
// Static data matching API structure for seamless future integration
const MOCK_DATA = {
  placesToVisit: [
    { name: 'Central Park', type: 'park', coordinates: { latitude: 40.7829, longitude: -73.9654 }, distance: 1200, rating: 4.8 },
    { name: 'Times Square', type: 'landmark', coordinates: { latitude: 40.758, longitude: -73.9855 }, distance: 800, rating: 4.5 },
    { name: 'Empire State Building', type: 'historic', coordinates: { latitude: 40.7484, longitude: -73.9857 }, distance: 1500, rating: 4.7 },
    { name: 'Brooklyn Bridge', type: 'bridge', coordinates: { latitude: 40.7061, longitude: -73.9969 }, distance: 3200, rating: 4.9 },
    { name: 'Statue of Liberty', type: 'monument', coordinates: { latitude: 40.6892, longitude: -74.0445 }, distance: 8500, rating: 4.8 },
    { name: 'Metropolitan Museum', type: 'museum', coordinates: { latitude: 40.7794, longitude: -73.9632 }, distance: 2100, rating: 4.9 },
    { name: 'High Line Park', type: 'park', coordinates: { latitude: 40.748, longitude: -74.0048 }, distance: 2800, rating: 4.6 },
  ],
  restaurants: [
    { name: 'The Modern', categories: ['Fine Dining', 'American'], address: '9 W 53rd St', rating: 4.7, distance: 900 },
    { name: 'Katz Delicatessen', categories: ['Deli', 'Jewish'], address: '205 E Houston St', rating: 4.5, distance: 2200 },
    { name: 'Le Bernardin', categories: ['French', 'Seafood'], address: '155 W 51st St', rating: 4.9, distance: 1100 },
    { name: 'Shake Shack', categories: ['Burgers', 'Fast Casual'], address: 'Madison Square Park', rating: 4.3, distance: 1800 },
    { name: 'Joe Pizza', categories: ['Pizza', 'Italian'], address: '7 Carmine St', rating: 4.6, distance: 3100 },
    { name: 'Momofuku Noodle Bar', categories: ['Asian', 'Ramen'], address: '171 1st Ave', rating: 4.4, distance: 2500 },
    { name: 'Eleven Madison Park', categories: ['Fine Dining'], address: '11 Madison Ave', rating: 4.8, distance: 1600 },
  ],
  accommodation: [
    { name: 'The Plaza Hotel', type: 'Luxury Hotel', rating: 4.8, priceRange: '$$$$', amenities: ['Spa', 'Pool', 'Restaurant'], distance: 1000 },
    { name: 'Park Hyatt', type: 'Luxury Hotel', rating: 4.7, priceRange: '$$$$', amenities: ['Spa', 'Gym', 'Bar'], distance: 1200 },
    { name: 'The Standard', type: 'Boutique Hotel', rating: 4.5, priceRange: '$$$', amenities: ['Rooftop', 'Restaurant'], distance: 2800 },
    { name: 'Pod Times Square', type: 'Budget Hotel', rating: 4.2, priceRange: '$$', amenities: ['WiFi', 'Cafe'], distance: 600 },
    { name: 'Ace Hotel', type: 'Boutique Hotel', rating: 4.4, priceRange: '$$$', amenities: ['Restaurant', 'Bar', 'Workspace'], distance: 1500 },
    { name: 'YOTEL', type: 'Modern Hotel', rating: 4.3, priceRange: '$$', amenities: ['Robot Luggage', 'Gym'], distance: 700 },
  ],
  holyPlaces: [
    { name: 'St. Patrick Cathedral', religion: 'christian', type: 'cathedral', coordinates: { latitude: 40.7585, longitude: -73.9766 } },
    { name: 'Temple Emanu-El', religion: 'jewish', type: 'synagogue', coordinates: { latitude: 40.7694, longitude: -73.9634 } },
    { name: 'Islamic Cultural Center', religion: 'muslim', type: 'mosque', coordinates: { latitude: 40.7831, longitude: -73.9576 } },
    { name: 'Trinity Church', religion: 'christian', type: 'church', coordinates: { latitude: 40.7081, longitude: -74.0125 } },
    { name: 'Hindu Temple Society', religion: 'hindu', type: 'temple', coordinates: { latitude: 40.7282, longitude: -73.8259 } },
  ],
  services: [
    { name: 'City Gym 24/7', type: 'gym', distance: 400 },
    { name: 'Central Pharmacy', type: 'pharmacy', distance: 250 },
    { name: 'Quick Mart', type: 'convenience_store', distance: 150 },
    { name: 'Chase Bank ATM', type: 'bank', distance: 300 },
    { name: 'Post Office', type: 'post_office', distance: 600 },
  ],
  news: [
    { title: 'New Subway Line Opens Next Month', description: 'The long-awaited extension will connect more neighborhoods to downtown.', source: 'City News', publishedAt: '2025-12-02' },
    { title: 'Local Festival This Weekend', description: 'Annual street fair returns with food vendors and live music.', source: 'Events Weekly', publishedAt: '2025-12-01' },
    { title: 'Restaurant Week Begins', description: 'Over 400 restaurants offering special prix-fixe menus through the month.', source: 'Food & Dining', publishedAt: '2025-11-30' },
    { title: 'Park Renovations Complete', description: 'New playgrounds and walking paths now open to the public.', source: 'Parks Dept', publishedAt: '2025-11-29' },
    { title: 'Weather Alert: Snow Expected', description: 'First major snowfall of the season predicted for this weekend.', source: 'Weather Center', publishedAt: '2025-11-28' },
  ],
};

// Section color constants
const SECTION_COLORS = {
  places: '#FF6B6B',
  restaurants: '#4ECDC4',
  accommodation: '#DDA0DD',
  holyPlaces: '#96CEB4',
  services: '#45B7D1',
  news: '#FFEAA7',
  history: '#9B59B6',
};

const HomeScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useAppTheme();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  
  // Scroll tracking for carousel indicators
  const [activePlaceIndex, setActivePlaceIndex] = useState(0);
  const [activeRestaurantIndex, setActiveRestaurantIndex] = useState(0);
  const [activeHolyPlaceIndex, setActiveHolyPlaceIndex] = useState(0);

  // Card width calculation for scroll tracking
  const CARD_WIDTH = Dimensions.get('window').width - 80 - 32 + 16;

  // Create dynamic styles based on current theme
  const styles = createHomeScreenStyles(colors, isDarkMode);

  // Helper to sort by rating (highest first) and center the best item
  const sortByRating = (data) => {
    if (!data || data.length === 0) return [];
    const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    // Rearrange so highest rated is in the middle for center display
    if (sorted.length >= 3) {
      const middle = Math.floor(sorted.length / 2);
      const highestRated = sorted.shift(); // Remove first (highest)
      sorted.splice(middle, 0, highestRated); // Insert at middle
    }
    return sorted;
  };

  // Use mock data sorted by rating
  const placesToVisit = sortByRating(MOCK_DATA.placesToVisit);
  const restaurants = sortByRating(MOCK_DATA.restaurants);
  const accommodation = sortByRating(MOCK_DATA.accommodation);
  const holyPlaces = MOCK_DATA.holyPlaces; // No rating for holy places
  const services = MOCK_DATA.services;
  const news = MOCK_DATA.news;

  // Get initial scroll offset to center the middle card
  const getInitialScrollIndex = (dataLength) => {
    return Math.floor(dataLength / 2);
  };

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    setIsLoading(true);
    try {
      const coords = await LocationService.getCurrentLocation();
      const locationDetails = await LocationService.getLocationDetails(
        coords.latitude,
        coords.longitude
      );
      
      if (locationDetails) {
        setCurrentLocation(locationDetails);
      } else {
        const defaultLocation = await LocationService.getDefaultLocationWithWikipedia();
        setCurrentLocation(defaultLocation);
      }
    } catch (error) {
      console.log('Location not available, using default location');
      try {
        const defaultLocation = await LocationService.getDefaultLocationWithWikipedia();
        setCurrentLocation(defaultLocation);
      } catch (fallbackError) {
        console.error('Error loading default location:', fallbackError);
        setCurrentLocation({
          name: 'New York',
          region: 'New York',
          country: 'United States',
          formattedAddress: 'New York, NY, USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          description: 'New York City is the most populous city in the United States, known for its iconic skyline, diverse culture, and world-famous landmarks.',
          history: 'New York City has a rich history spanning over 400 years, from its origins as a Dutch trading post to becoming one of the world\'s most influential cities.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFirstSentence = (text) => {
    if (!text) return '';
    const sentences = text.split(/[.!?]+/);
    return sentences[0] + (sentences[0] ? '.' : '');
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
  };

  const navigateTo = (screen, params = {}) => {
    navigation.navigate(screen, { location: currentLocation, ...params });
  };

  // Scroll handlers for carousel indicators
  const handlePlaceScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / CARD_WIDTH);
    setActivePlaceIndex(Math.max(0, Math.min(index, placesToVisit.length - 1)));
  };

  const handleRestaurantScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / CARD_WIDTH);
    setActiveRestaurantIndex(Math.max(0, Math.min(index, restaurants.length - 1)));
  };

  const handleHolyPlaceScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / CARD_WIDTH);
    setActiveHolyPlaceIndex(Math.max(0, Math.min(index, holyPlaces.length - 1)));
  };

  // Render scroll indicators
  const renderScrollIndicators = (totalItems, activeIndex) => (
    <View style={styles.scrollIndicatorContainer}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <View
          key={`dot-${index}`}
          style={[
            styles.scrollDot,
            activeIndex === index && styles.scrollDotActive,
          ]}
        />
      ))}
    </View>
  );

  // ============ RENDER FUNCTIONS ============

  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.placeCard}
      onPress={() => navigateTo('PlacesDetail')}
      activeOpacity={0.9}
    >
      <View style={[styles.cardIconBox, { backgroundColor: SECTION_COLORS.places }]}>
        <Ionicons name="camera" size={56} color="#FFF" />
        {item.rating && (
          <View style={styles.cardRatingBadge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.cardRatingText}>{item.rating}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {item.distance ? `${(item.distance / 1000).toFixed(1)} km away` : item.type}
        </Text>
        <Text style={styles.cardDetailsLabel}>View Details</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRestaurantCard = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => navigateTo('RestaurantsDetail')}
      activeOpacity={0.9}
    >
      <View style={[styles.restaurantIconBox, { backgroundColor: SECTION_COLORS.restaurants }]}>
        <Ionicons name="restaurant" size={56} color="#FFF" />
        {item.rating && (
          <View style={styles.cardRatingBadge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.cardRatingText}>{item.rating}</Text>
          </View>
        )}
      </View>
      <View style={styles.restaurantContent}>
        <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.restaurantCategory} numberOfLines={1}>
          {item.categories?.join(' | ') || item.address}
        </Text>
        <View style={styles.restaurantButtonRow}>
          <View style={styles.restaurantButton}>
            <Text style={styles.restaurantButtonText}>Details</Text>
          </View>
          <View style={styles.restaurantButton}>
            <Text style={styles.restaurantButtonText}>View Menu</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAccommodationCard = (item, index) => (
    <TouchableOpacity
      key={`accommodation-${index}`}
      style={styles.accommodationCard}
      onPress={() => navigateTo('AccommodationDetail')}
      activeOpacity={0.9}
    >
      <View style={[styles.accommodationImageBox, { backgroundColor: SECTION_COLORS.accommodation }]}>
        <Ionicons name="bed" size={64} color="#FFF" />
        <TouchableOpacity style={styles.accommodationBookmark} activeOpacity={0.7}>
          <Ionicons name="bookmark-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.accommodationContent}>
        <Text style={styles.accommodationName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.accommodationMeta}>
          <Text style={styles.accommodationRating}>{item.priceRange}</Text>
          <Text style={styles.accommodationDivider}>|</Text>
          <Text style={styles.accommodationType} numberOfLines={1}>{item.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHolyPlaceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.holyPlaceCard}
      onPress={() => navigateTo('HolyPlacesDetail')}
      activeOpacity={0.9}
    >
      <View style={[styles.holyPlaceIconBox, { backgroundColor: SECTION_COLORS.holyPlaces }]}>
        <Ionicons name="flower" size={64} color="#FFF" />
      </View>
      <View style={styles.holyPlaceContent}>
        <Text style={styles.holyPlaceName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.holyPlaceType}>{item.type} | {item.religion}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderNewsCard = ({ item }) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => navigateTo('NewsDetail')}
      activeOpacity={0.7}
    >
      <View style={styles.newsIconBox}>
        <Ionicons name="newspaper" size={48} color="#333" />
      </View>
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.newsDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  // Handle news scroll pagination
  const handleNewsScroll = (event) => {
    const slideWidth = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.round(offset / slideWidth);
    setActiveNewsIndex(activeIndex);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ============ COMPACT HEADER ============ */}
      <View style={styles.compactHeader}>
        <TouchableOpacity
          style={styles.headerCityButton}
          onPress={() => setShowSearchModal(true)}
        >
          <Ionicons name="location-outline" size={SIZES.iconMedium} color={colors.primary} />
          <Text style={styles.cityName}>{currentLocation?.name || 'Select City'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={SIZES.iconMedium}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ============ CITY INFO CARD ============ */}
        <View style={styles.cityInfoCard}>
          <Text style={styles.cityDescription}>
            {getFirstSentence(currentLocation?.description) || 'Discover amazing places around you.'}
          </Text>
          <View style={styles.cityInfoActions}>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => navigateTo('LocationDetail')}
            >
              <Text style={styles.readMoreText}>read more</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchCircle}
              onPress={() => setShowSearchModal(true)}
            >
              <Ionicons name="search" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chip Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScrollView}
          contentContainerStyle={styles.chipScrollContent}
        >
          <TouchableOpacity style={styles.chip} onPress={() => navigateTo('HistoryDetail')}>
            <Ionicons name="library-outline" size={16} color={SECTION_COLORS.history} style={styles.chipIcon} />
            <Text style={styles.chipLabel}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => navigateTo('RestaurantsDetail')}>
            <Ionicons name="restaurant-outline" size={16} color={SECTION_COLORS.restaurants} style={styles.chipIcon} />
            <Text style={styles.chipLabel}>Restaurants</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => navigateTo('ServicesDetail')}>
            <Ionicons name="business-outline" size={16} color={SECTION_COLORS.services} style={styles.chipIcon} />
            <Text style={styles.chipLabel}>Services</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ============ PLACES TO VISIT ============ */}
        {placesToVisit.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Places To Visit</Text>
              <TouchableOpacity onPress={() => navigateTo('PlacesDetail')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={placesToVisit.slice(0, 7)}
              renderItem={renderPlaceCard}
              keyExtractor={(item, index) => `place-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
              contentContainerStyle={styles.horizontalListContent}
              snapToInterval={CARD_WIDTH}
              snapToAlignment="start"
              decelerationRate={0.9}
              onScroll={handlePlaceScroll}
              scrollEventThrottle={16}
              initialScrollIndex={getInitialScrollIndex(Math.min(placesToVisit.length, 7))}
              getItemLayout={(data, index) => ({
                length: CARD_WIDTH,
                offset: CARD_WIDTH * index,
                index,
              })}
            />
            {renderScrollIndicators(Math.min(placesToVisit.length, 7), activePlaceIndex)}
          </View>
        )}

        {/* ============ LOCAL RESTAURANTS ============ */}
        {restaurants.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Local Restaurants</Text>
              <TouchableOpacity onPress={() => navigateTo('RestaurantsDetail')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={restaurants.slice(0, 7)}
              renderItem={renderRestaurantCard}
              keyExtractor={(item, index) => `restaurant-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
              contentContainerStyle={styles.horizontalListContent}
              snapToInterval={CARD_WIDTH}
              snapToAlignment="start"
              decelerationRate={0.9}
              onScroll={handleRestaurantScroll}
              scrollEventThrottle={16}
              initialScrollIndex={getInitialScrollIndex(Math.min(restaurants.length, 7))}
              getItemLayout={(data, index) => ({
                length: CARD_WIDTH,
                offset: CARD_WIDTH * index,
                index,
              })}
            />
            {renderScrollIndicators(Math.min(restaurants.length, 7), activeRestaurantIndex)}
          </View>
        )}

        {/* ============ NEARBY ACCOMMODATION ============ */}
        {accommodation.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Accommodation</Text>
            </View>
            <View style={styles.accommodationGrid}>
              {accommodation.slice(0, 4).map((item, index) => renderAccommodationCard(item, index))}
            </View>
          </View>
        )}

        {/* ============ HOLY PLACES ============ */}
        {holyPlaces.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Holy Places</Text>
            </View>
            <FlatList
              data={holyPlaces.slice(0, 5)}
              renderItem={renderHolyPlaceCard}
              keyExtractor={(item, index) => `holy-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
              contentContainerStyle={styles.horizontalListContent}
              snapToInterval={CARD_WIDTH}
              snapToAlignment="start"
              decelerationRate={0.9}
              onScroll={handleHolyPlaceScroll}
              scrollEventThrottle={16}
              initialScrollIndex={getInitialScrollIndex(Math.min(holyPlaces.length, 5))}
              getItemLayout={(data, index) => ({
                length: CARD_WIDTH,
                offset: CARD_WIDTH * index,
                index,
              })}
            />
            {renderScrollIndicators(Math.min(holyPlaces.length, 5), activeHolyPlaceIndex)}
          </View>
        )}

        {/* ============ SERVICES AND AMENITIES ============ */}
        {services.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Services and Amenities</Text>
            </View>
            <View style={styles.serviceListCard}>
              <ScrollView
                style={styles.serviceScrollView}
                contentContainerStyle={styles.serviceScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {services.map((service, index) => (
                  <TouchableOpacity
                    key={`service-${index}`}
                    style={[
                      styles.serviceRow,
                      index === services.length - 1 && styles.serviceRowLast,
                    ]}
                    onPress={() => navigateTo('ServicesDetail')}
                  >
                    <View style={[styles.serviceIconCircle, { backgroundColor: SECTION_COLORS.services + '20' }]}>
                      <Ionicons name="business" size={18} color={SECTION_COLORS.services} />
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.serviceLink}>call detail and review</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* ============ LATEST NEWS IN AREA ============ */}
        {news.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest News in Area</Text>
              <TouchableOpacity onPress={() => navigateTo('NewsDetail')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.newsContainer}>
              <ScrollView
                style={styles.newsScrollView}
                contentContainerStyle={styles.newsScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {news.map((item, index) => (
                  <TouchableOpacity
                    key={`news-${index}`}
                    style={[
                      styles.newsCard,
                      index === news.length - 1 && styles.newsCardLast,
                    ]}
                    onPress={() => navigateTo('NewsDetail')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.newsIconBox}>
                      <Ionicons name="newspaper" size={36} color="#333" />
                    </View>
                    <View style={styles.newsContent}>
                      <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                      <Text style={styles.newsDescription} numberOfLines={2}>{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Location Search Modal */}
      <LocationSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
