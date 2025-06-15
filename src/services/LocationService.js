import * as Location from 'expo-location';
import { 
  NEWSDATA_API_KEY, 
  OPENTRIPMAP_API_KEY, 
  FOURSQUARE_API_KEY, 
  GEMINI_API_KEY 
} from '@env';

// API Configuration
const API_CONFIG = {
  // NewsData.io API
  NEWS_API: {
    baseUrl: 'https://newsdata.io/api/1/news',
    apiKey: NEWSDATA_API_KEY
  },
    // OpenTripMap API
  OPENTRIPMAP_API: {
    baseUrl: 'https://api.opentripmap.com/0.1/en/places',
    apiKey: OPENTRIPMAP_API_KEY
  },
  
  // Foursquare API
  FOURSQUARE_API: {
    baseUrl: 'https://api.foursquare.com/v3/places/search',
    apiKey: FOURSQUARE_API_KEY
  },
  
  // Google Gemini API
  GEMINI_API: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    apiKey: GEMINI_API_KEY
  },
  
  // OpenStreetMap Nominatim API
  NOMINATIM_API: {
    baseUrl: 'https://nominatim.openstreetmap.org/search'
  },
  
  // Overpass API for holy places
  OVERPASS_API: {
    baseUrl: 'https://overpass-api.de/api/interpreter'
  }
};

export const LocationService = {
  // Request location permissions
  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  },
  // Get current location (optional - gracefully handles permission denial)
  async getCurrentLocation() {
    try {
      // Check if location permissions are available
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Try to request permission
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        
        if (newStatus !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000, // 10 second timeout
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  },

  // Reverse geocode (coordinates to location name)
  async reverseGeocode(latitude, longitude) {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        const location = result[0];
        return {
          city: location.city || location.subregion || 'Unknown City',
          region: location.region || location.country || 'Unknown Region',
          country: location.country || 'Unknown Country',
          formattedAddress: this.formatAddress(location),
        };
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  },

  // Format address from location object
  formatAddress(location) {
    const parts = [];
    
    if (location.name) parts.push(location.name);
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.country) parts.push(location.country);
    
    return parts.join(', ') || 'Unknown Location';  },

  // Search for locations using Nominatim API (no permissions required)
  async searchLocations(query) {
    try {
      const response = await fetch(
        `${API_CONFIG.NOMINATIM_API.baseUrl}?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CurioCity/1.0 (React Native Expo App)',
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return data.map(location => ({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          name: location.display_name,
          formattedAddress: location.display_name
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching locations:', error);      return [];
    }
  },

  // Get Wikipedia content for a location
  async getWikipediaContent(locationName) {
    try {
      // First, search for the page
      const searchResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(locationName)}`
      );
      
      if (!searchResponse.ok) {
        console.warn(`Wikipedia API returned ${searchResponse.status} for ${locationName}`);
        return null;
      }

      const data = await searchResponse.json();
      
      // Check if it's a disambiguation page or not found
      if (data.type === 'disambiguation' || data.type === 'no-extract') {
        console.warn(`Wikipedia disambiguation or no extract for ${locationName}`);
        return null;
      }
      
      return {
        title: data.title,
        description: data.extract || `${locationName} is a fascinating location with rich history and culture.`,
        fullDescription: data.extract || `Explore ${locationName} and discover its unique attractions, local culture, and historical significance. This destination offers visitors an authentic experience with plenty to see and do.`,
        thumbnail: data.thumbnail?.source || null,
        pageUrl: data.content_urls?.desktop?.page || null,
        coordinates: data.coordinates ? {
          latitude: data.coordinates.lat,
          longitude: data.coordinates.lon
        } : null
      };
    } catch (error) {
      console.error('Wikipedia API error:', error);
      return null;
    }
  },
  // Get location details for a specific place with comprehensive API integration
  async getLocationDetails(latitude, longitude) {
    try {
      const locationInfo = await this.reverseGeocode(latitude, longitude);
      
      if (!locationInfo) {
        return null;
      }

      // Get comprehensive data from all APIs
      const comprehensiveData = await this.getComprehensiveLocationData(
        locationInfo.city,
        latitude,
        longitude
      );
      
      // Fallback descriptions if Wikipedia fails
      const fallbackDescription = `Welcome to ${locationInfo.city}, ${locationInfo.country}! This beautiful location offers a rich blend of culture, history, and modern attractions.`;
      const fallbackFullDescription = `${locationInfo.city} is a vibrant destination located in ${locationInfo.region}, ${locationInfo.country}. Known for its unique character and local attractions, this location offers visitors an authentic experience of the region's culture and heritage.`;

      return {
        name: locationInfo.city,
        description: comprehensiveData.wikipedia?.description || fallbackDescription,
        fullDescription: comprehensiveData.wikipedia?.fullDescription || fallbackFullDescription,
        coordinates: { latitude, longitude },
        formattedAddress: locationInfo.formattedAddress,
        region: locationInfo.region,
        country: locationInfo.country,
        thumbnail: comprehensiveData.wikipedia?.thumbnail || null,
        wikipediaUrl: comprehensiveData.wikipedia?.pageUrl || null,
        hasWikipediaData: !!comprehensiveData.wikipedia,        wikipediaTitle: comprehensiveData.wikipedia?.title || null,
        
        // Real API data for all sections
        news: comprehensiveData.news,
        placesToVisit: comprehensiveData.placesToVisit,
        restaurants: comprehensiveData.restaurants,
        holyPlaces: comprehensiveData.holyPlaces,
        accommodation: comprehensiveData.accommodation,
        services: comprehensiveData.services,
        history: comprehensiveData.generatedHistory,
        
        // Metadata
        hasRealData: true,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting location details:', error);
      return null;
    }
  },  // Default location data (New York as fallback)
  getDefaultLocation() {
    return {
      name: 'New York',
      description: 'Welcome to New York, the city that never sleeps! Known as the Big Apple, New York City is a global hub for business, arts, fashion, and culture.',
      fullDescription: 'New York City, often simply called New York, is the most populous city in the United States. Located at the southern tip of the state of New York, it is composed of five boroughs: Manhattan, Brooklyn, Queens, The Bronx, and Staten Island. NYC is a global center for finance, technology, arts, fashion, and culture, home to iconic landmarks like the Statue of Liberty, Empire State Building, and Central Park.',
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      formattedAddress: 'New York, NY, USA',
      region: 'New York',
      country: 'United States',
    };
  },  // Enhanced default location with comprehensive API data
  async getDefaultLocationWithWikipedia() {
    try {
      const defaultLocation = this.getDefaultLocation();
      const comprehensiveData = await this.getComprehensiveLocationData(
        'New York',
        40.7128,
        -74.0060
      );
      
      return {
        ...defaultLocation,
        description: comprehensiveData.wikipedia?.description || defaultLocation.description,
        fullDescription: comprehensiveData.wikipedia?.fullDescription || defaultLocation.fullDescription,
        thumbnail: comprehensiveData.wikipedia?.thumbnail,
        wikipediaUrl: comprehensiveData.wikipedia?.pageUrl,
        hasWikipediaData: !!comprehensiveData.wikipedia,
        wikipediaTitle: comprehensiveData.wikipedia?.title,
          // Real API data for all sections
        news: comprehensiveData.news,
        placesToVisit: comprehensiveData.placesToVisit,
        restaurants: comprehensiveData.restaurants,
        holyPlaces: comprehensiveData.holyPlaces,
        accommodation: comprehensiveData.accommodation,
        services: comprehensiveData.services,
        history: comprehensiveData.generatedHistory,
        
        // Metadata
        hasRealData: true,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting comprehensive data for New York:', error);
      return this.getDefaultLocation();
    }
  },

  // Get local news for a location
  async getLocalNews(locationName, country = 'in') {
    try {
      const response = await fetch(
        `${API_CONFIG.NEWS_API.baseUrl}?apikey=${API_CONFIG.NEWS_API.apiKey}&q=${encodeURIComponent(locationName)}&country=${country}&language=en&size=10`
      );
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.results?.map(article => ({
        title: article.title,
        description: article.description,
        url: article.link,
        publishedAt: article.pubDate,
        source: article.source_id,
        imageUrl: article.image_url
      })) || [];
    } catch (error) {
      console.error('Error fetching local news:', error);
      return [];
    }
  },  // Get places of interest from multiple sources and combine results
  async getPlacesToVisit(latitude, longitude, radius = 10000) {
    try {
      // Get tourist attractions from OpenTripMap with different categories
      const touristAttractionsPromise = this.getOpenTripMapTouristAttractions(latitude, longitude, radius);
      const culturalSitesPromise = this.getOpenTripMapCulturalSites(latitude, longitude, radius);
      
      // Wait for both API calls to complete
      const [touristResults, culturalResults] = await Promise.all([
        touristAttractionsPromise,
        culturalSitesPromise
      ]);
      
      // Combine and deduplicate results
      const combinedResults = [...touristResults, ...culturalResults];
      return this.deduplicatePlaces(combinedResults);
      
    } catch (error) {
      console.error('Error fetching places to visit:', error);
      return [];
    }
  },
  // Get tourist attractions from OpenTripMap
  async getOpenTripMapTouristAttractions(latitude, longitude, radius = 10000) {
    try {
      const response = await fetch(
        `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${radius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=interesting_places,tourist_facilities,historic,museums,monuments_and_memorials&limit=15`
      );
      
      if (!response.ok) {
        console.log(`OpenTripMap tourist attractions API warning: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      return data?.map(place => ({
        name: place.name || 'Tourist Attraction',
        type: place.kinds,
        coordinates: {
          latitude: place.point.lat,
          longitude: place.point.lon
        },
        distance: place.dist,
        rating: place.rate || 0,
        source: 'OpenTripMap'
      })) || [];
    } catch (error) {
      console.error('Error fetching OpenTripMap tourist attractions:', error);
      return [];
    }
  },
  // Get cultural sites from OpenTripMap
  async getOpenTripMapCulturalSites(latitude, longitude, radius = 10000) {
    try {      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for OpenTripMap cultural sites');
        return [];
      }
      
      // Ensure reasonable radius
      const validRadius = Math.min(Math.max(radius, 1000), 50000);
      
      const response = await fetch(
        `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${validRadius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=cultural,architecture,archaeological_sites,palaces,castles&limit=15`
      );
      
      if (!response.ok) {
        console.log(`OpenTripMap cultural sites API warning: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      return data?.map(place => ({
        name: place.name || 'Cultural Site',
        type: place.kinds,
        coordinates: {
          latitude: place.point.lat,
          longitude: place.point.lon
        },
        distance: place.dist,
        rating: place.rate || 0,
        source: 'OpenTripMap'
      })) || [];
    } catch (error) {
      console.error('Error fetching OpenTripMap cultural sites:', error);
      return [];
    }
  },

  // Deduplicate places based on name and proximity
  deduplicatePlaces(places) {
    const uniquePlaces = [];
    const seen = new Set();
    
    for (const place of places) {
      // Create a key based on name and approximate location
      const key = `${place.name?.toLowerCase()}_${Math.round(place.coordinates?.latitude * 1000)}_${Math.round(place.coordinates?.longitude * 1000)}`;
      
      if (!seen.has(key) && place.name && place.name !== 'Tourist Attraction' && place.name !== 'Cultural Site') {
        seen.add(key);
        uniquePlaces.push(place);
      }
    }
    
    return uniquePlaces;
  },

  // Get restaurants using Foursquare API
    // Get restaurants from multiple sources and combine results
  async getLocalRestaurants(locationName, latitude, longitude) {
    try {
      // Get restaurants from Foursquare
      const foursquarePromise = this.getFoursquareRestaurants(locationName);
      
      // Get restaurants from OpenTripMap
      const opentripmapPromise = this.getOpenTripMapRestaurants(latitude, longitude);
      
      // Wait for both APIs to complete
      const [foursquareResults, opentripmapResults] = await Promise.all([
        foursquarePromise,
        opentripmapPromise
      ]);
      
      // Combine and deduplicate results
      const combinedResults = [...foursquareResults, ...opentripmapResults];
      return this.deduplicateRestaurants(combinedResults);
      
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  },

  // Get restaurants from Foursquare API
  async getFoursquareRestaurants(locationName) {
    try {
      const response = await fetch(
        `${API_CONFIG.FOURSQUARE_API.baseUrl}?near=${encodeURIComponent(locationName)}&categories=13065&limit=20`,
        {
          headers: {
            'Authorization': API_CONFIG.FOURSQUARE_API.apiKey,
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Foursquare API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.results?.map(restaurant => ({
        name: restaurant.name,
        address: restaurant.location?.formatted_address,
        categories: restaurant.categories?.map(cat => cat.name),
        rating: restaurant.rating,
        coordinates: {
          latitude: restaurant.geocodes?.main?.latitude,
          longitude: restaurant.geocodes?.main?.longitude
        },
        distance: restaurant.distance,
        source: 'Foursquare'
      })) || [];
    } catch (error) {
      console.error('Error fetching Foursquare restaurants:', error);
      return [];
    }
  },
  // Get restaurants from OpenTripMap API
  async getOpenTripMapRestaurants(latitude, longitude, radius = 10000) {
    try {
      const response = await fetch(
        `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${radius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=foods&limit=20`
      );
      
      if (!response.ok) {
        console.log(`OpenTripMap restaurants API warning: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      return data?.map(restaurant => ({
        name: restaurant.name || 'Restaurant',
        type: restaurant.kinds,
        coordinates: {
          latitude: restaurant.point.lat,
          longitude: restaurant.point.lon
        },
        distance: restaurant.dist,
        rating: restaurant.rate || 0,
        categories: ['Restaurant'],
        source: 'OpenTripMap'
      })) || [];
    } catch (error) {
      console.error('Error fetching OpenTripMap restaurants:', error);
      return [];
    }
  },

  // Deduplicate restaurants based on name and proximity
  deduplicateRestaurants(restaurants) {
    const uniqueRestaurants = [];
    const seen = new Set();
    
    for (const restaurant of restaurants) {
      // Create a key based on name and approximate location
      const key = `${restaurant.name?.toLowerCase()}_${Math.round(restaurant.coordinates?.latitude * 1000)}_${Math.round(restaurant.coordinates?.longitude * 1000)}`;
      
      if (!seen.has(key) && restaurant.name) {
        seen.add(key);
        uniqueRestaurants.push(restaurant);
      }
    }
    
    return uniqueRestaurants;
  },

  // Get holy places using Overpass API
  async getHolyPlaces(latitude, longitude, radius = 0.01) {
    try {
      const latMin = latitude - radius;
      const latMax = latitude + radius;
      const lngMin = longitude - radius;
      const lngMax = longitude + radius;
      
      const query = `[out:json];node["amenity"="place_of_worship"](${latMin},${lngMin},${latMax},${lngMax});out;`;
      
      const response = await fetch(
        `${API_CONFIG.OVERPASS_API.baseUrl}?data=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.elements?.map(place => ({
        name: place.tags?.name || 'Unnamed Place of Worship',
        religion: place.tags?.religion || 'Unknown',
        type: place.tags?.place_of_worship || place.tags?.amenity,
        coordinates: {
          latitude: place.lat,
          longitude: place.lon
        },
        address: place.tags?.['addr:full'] || place.tags?.['addr:street']
      })) || [];
    } catch (error) {
      console.error('Error fetching holy places:', error);
      return [];
    }
  },  // Get services and amenities from multiple sources and combine results (excluding accommodation)
  async getLocalServices(latitude, longitude, radius = 10000) {
    try {
      // Get services from OpenTripMap (excluding accommodation)
      const servicesPromise = this.getOpenTripMapServices(latitude, longitude, radius);
      
      // Wait for API calls to complete
      const [servicesResults] = await Promise.all([
        servicesPromise
      ]);
      
      // Combine and deduplicate results
      const combinedResults = [...servicesResults];
      const deduplicatedResults = this.deduplicateServices(combinedResults);
      
      return deduplicatedResults;
      
    } catch (error) {
      console.error('Error fetching local services:', error);
      return [];
    }
  },
  // Deduplicate services based on name and proximity
  deduplicateServices(services) {
    const uniqueServices = [];
    const seen = new Set();
    
    for (const service of services) {
      // Create a key based on name and approximate location
      const key = `${service.name?.toLowerCase()}_${Math.round(service.coordinates?.latitude * 1000)}_${Math.round(service.coordinates?.longitude * 1000)}`;
      
      if (!seen.has(key) && service.name && service.name.trim() !== '') {
        seen.add(key);
        uniqueServices.push(service);
      }
    }
    
    return uniqueServices;
  },// Get general services from OpenTripMap
  async getOpenTripMapServices(latitude, longitude, radius = 10000) {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for OpenTripMap services');
        return [];
      }
      
      // Ensure reasonable radius
      const validRadius = Math.min(Math.max(radius, 1000), 50000);      // Use only valid OpenTripMap categories (based on API testing)
      // Valid categories: banks, shops, sport
      // Invalid categories removed: hospitals, pharmacy, police, post_offices, education
      const url = `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${validRadius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=banks,shops,sport&limit=50`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.log(`OpenTripMap services API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      const mappedData = data?.map(service => ({
        name: service.name || 'Unnamed Service',
        type: service.kinds,
        coordinates: {
          latitude: service.point.lat,
          longitude: service.point.lon
        },        distance: service.dist,
        source: 'OpenTripMap'
      })) || [];
      
      return mappedData;
    } catch (error) {
      console.error('Error fetching OpenTripMap services:', error);
      return [];
    }  },

  // Get accommodation from multiple sources and combine results
  async getAccommodation(latitude, longitude, radius = 10000) {
    try {
      // Get hotels and accommodation from OpenTripMap
      const opentripmapPromise = this.getOpenTripMapAccommodation(latitude, longitude, radius);
      
      // Get hotels from Foursquare if needed (can be added later)
      // const foursquarePromise = this.getFoursquareAccommodation(locationName);
      
      // Wait for API calls to complete
      const [opentripmapResults] = await Promise.all([
        opentripmapPromise
      ]);
      
      // Combine and deduplicate results
      const combinedResults = [...opentripmapResults];
      return this.deduplicateAccommodation(combinedResults);
      
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      return [];
    }
  },

  // Get accommodation from OpenTripMap API
  async getOpenTripMapAccommodation(latitude, longitude, radius = 10000) {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for OpenTripMap accommodation');
        return [];
      }
      
      // Ensure reasonable radius
      const validRadius = Math.min(Math.max(radius, 1000), 50000);
      
      const response = await fetch(
        `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${validRadius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=accomodations&limit=25`
      );
      
      if (!response.ok) {
        console.log(`OpenTripMap accommodation API warning: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      return data?.map(hotel => ({
        name: hotel.name || 'Hotel',
        type: this.categorizeAccommodationType(hotel.kinds),
        coordinates: {
          latitude: hotel.point.lat,
          longitude: hotel.point.lon
        },
        distance: hotel.dist,
        rating: hotel.rate || null,
        amenities: this.extractAmenities(hotel.kinds),
        priceRange: this.estimatePriceRange(hotel.kinds, hotel.rate),
        source: 'OpenTripMap'
      })) || [];
    } catch (error) {
      console.error('Error fetching OpenTripMap accommodation:', error);
      return [];
    }
  },

  // Categorize accommodation type based on OpenTripMap kinds
  categorizeAccommodationType(kinds) {
    if (!kinds) return 'Hotel';
    
    const kindsLower = kinds.toLowerCase();
    
    if (kindsLower.includes('resort')) return 'Resort';
    if (kindsLower.includes('hostel')) return 'Hostel';
    if (kindsLower.includes('guest_house') || kindsLower.includes('guesthouse')) return 'Guest House';
    if (kindsLower.includes('apartment')) return 'Apartment';
    if (kindsLower.includes('villa')) return 'Villa';
    if (kindsLower.includes('bed_and_breakfast') || kindsLower.includes('bnb')) return 'B&B';
    if (kindsLower.includes('luxury')) return 'Luxury Hotel';
    if (kindsLower.includes('budget')) return 'Budget Hotel';
    
    return 'Hotel';
  },

  // Extract amenities from accommodation kinds
  extractAmenities(kinds) {
    if (!kinds) return [];
    
    const amenities = [];
    const kindsLower = kinds.toLowerCase();
    
    if (kindsLower.includes('wifi')) amenities.push('WiFi');
    if (kindsLower.includes('pool')) amenities.push('Swimming Pool');
    if (kindsLower.includes('spa')) amenities.push('Spa');
    if (kindsLower.includes('restaurant')) amenities.push('Restaurant');
    if (kindsLower.includes('fitness')) amenities.push('Fitness Center');
    if (kindsLower.includes('parking')) amenities.push('Parking');
    if (kindsLower.includes('pet')) amenities.push('Pet Friendly');
    if (kindsLower.includes('business')) amenities.push('Business Center');
    if (kindsLower.includes('conference')) amenities.push('Conference Rooms');
    
    // Default amenities for hotels
    if (amenities.length === 0) {
      amenities.push('Standard Rooms', 'Reception', 'Housekeeping');
    }
    
    return amenities;
  },

  // Estimate price range based on type and rating
  estimatePriceRange(kinds, rating) {
    const kindsLower = kinds?.toLowerCase() || '';
    
    if (kindsLower.includes('luxury') || (rating && rating >= 4.5)) return '$$$$ (Luxury)';
    if (kindsLower.includes('resort') || (rating && rating >= 4.0)) return '$$$ (Premium)';
    if (kindsLower.includes('budget') || kindsLower.includes('hostel')) return '$ (Budget)';
    if (rating && rating >= 3.5) return '$$ (Mid-range)';
    
    return '$$ (Standard)';
  },

  // Deduplicate accommodation based on name and proximity
  deduplicateAccommodation(accommodation) {
    const uniqueAccommodation = [];
    const seen = new Set();
    
    for (const hotel of accommodation) {
      // Create a key based on name and approximate location
      const key = `${hotel.name?.toLowerCase()}_${Math.round(hotel.coordinates?.latitude * 1000)}_${Math.round(hotel.coordinates?.longitude * 1000)}`;
      
      if (!seen.has(key) && hotel.name && hotel.name !== 'Hotel') {
        seen.add(key);
        uniqueAccommodation.push(hotel);
      }
    }
    
    return uniqueAccommodation;
  },

  // Generate content using Gemini AI
  async generateContentWithGemini(prompt) {
    try {
      const response = await fetch(
        `${API_CONFIG.GEMINI_API.baseUrl}?key=${API_CONFIG.GEMINI_API.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      return '';
    }
  },
  // Get comprehensive location data with all APIs
  async getComprehensiveLocationData(locationName, latitude, longitude) {
    try {      const [
        news,
        placesToVisit,
        restaurants,
        holyPlaces,
        accommodation,
        services,
        wikipediaContent
      ] = await Promise.allSettled([
        this.getLocalNews(locationName),
        this.getPlacesToVisit(latitude, longitude),
        this.getLocalRestaurants(locationName, latitude, longitude),
        this.getHolyPlaces(latitude, longitude),
        this.getAccommodation(latitude, longitude),
        this.getLocalServices(latitude, longitude),
        this.getWikipediaContent(locationName)
      ]);

      // Generate historical content using Gemini AI
      const historyPrompt = `Write a brief historical overview of ${locationName}. Include key historical events, cultural significance, and important landmarks. Keep it informative but concise, around 200 words.`;
      const generatedHistory = await this.generateContentWithGemini(historyPrompt);

      return {
        news: news.status === 'fulfilled' ? news.value : [],
        placesToVisit: placesToVisit.status === 'fulfilled' ? placesToVisit.value : [],
        restaurants: restaurants.status === 'fulfilled' ? restaurants.value : [],
        holyPlaces: holyPlaces.status === 'fulfilled' ? holyPlaces.value : [],
        accommodation: accommodation.status === 'fulfilled' ? accommodation.value : [],
        services: services.status === 'fulfilled' ? services.value : [],
        wikipedia: wikipediaContent.status === 'fulfilled' ? wikipediaContent.value : null,
        generatedHistory: generatedHistory || `${locationName} has a rich history and cultural heritage that spans many centuries.`
      };
    } catch (error) {
      console.error('Error getting comprehensive location data:', error);      return {
        news: [],
        placesToVisit: [],
        restaurants: [],
        holyPlaces: [],
        accommodation: [],
        services: [],
        wikipedia: null,
        generatedHistory: ''      };
    }
  },
};
