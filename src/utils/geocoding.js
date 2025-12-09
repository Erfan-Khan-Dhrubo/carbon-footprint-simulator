// Location coordinates for major cities in Bangladesh
const LOCATIONS = {
  dhaka: { lat: 23.8103, lon: 90.4125, name: "Dhaka" },
  chittagong: { lat: 22.3569, lon: 91.7832, name: "Chittagong" },
  sylhet: { lat: 24.9045, lon: 91.8611, name: "Sylhet" },
  rajshahi: { lat: 24.3745, lon: 88.6042, name: "Rajshahi" },
  khulna: { lat: 22.8456, lon: 89.5403, name: "Khulna" },
};

// Helper function to normalize location name for lookup
function normalizeLocationName(location) {
  const lower = location.toLowerCase().trim();
  // Try to match common variations
  if (lower.includes("dhaka") || lower.includes("dacca")) return "dhaka";
  if (lower.includes("chittagong") || lower.includes("chattogram"))
    return "chittagong";
  if (lower.includes("sylhet")) return "sylhet";
  if (lower.includes("rajshahi")) return "rajshahi";
  if (lower.includes("khulna")) return "khulna";
  return lower;
}

/**
 * Get coordinates for a location name
 * First tries to match against known locations, then attempts geocoding
 * @param {string} locationName - Location name
 * @returns {Promise<{lat: number, lon: number, source: string}>} Coordinates object with source info
 */
export async function getCoordinates(locationName) {
  if (!locationName || locationName.trim() === '') {
    throw new Error('Location name is required');
  }

  const normalized = normalizeLocationName(locationName);
  const knownLocation = LOCATIONS[normalized];

  // If found in known locations, return immediately
  if (knownLocation) {
    return { 
      lat: knownLocation.lat, 
      lon: knownLocation.lon,
      source: 'known_location',
      name: knownLocation.name
    };
  }

  // Otherwise, try geocoding using OpenStreetMap Nominatim API
  try {
    // Use a CORS proxy or direct API call
    // Note: Nominatim may have CORS restrictions, so we'll try direct first
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      locationName
    )}&limit=1&addressdetails=1`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'CarbonFootprintSimulator/1.0',
        'Accept': 'application/json',
      },
      // Add mode to handle CORS
      mode: 'cors',
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          source: 'nominatim',
          name: result.display_name || locationName
        };
      }
    }
  } catch (error) {
    console.warn('Geocoding API error (may be CORS related):', error);
    
    // If CORS fails, try using a CORS proxy (optional - you can add your own)
    // For now, we'll use fallback coordinates
    // Fallback coordinates will be used
  }

  // Fallback: Generate placeholder coordinates based on location name hash
  // This ensures different locations get different (but consistent) coordinates
  const hash = locationName.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Generate coordinates in Bangladesh region (roughly 20-26°N, 88-93°E)
  const fallbackLat = 23.5 + (hash % 100) / 1000; // Around 23.5°N ± 0.1°
  const fallbackLon = 90.0 + ((hash >> 8) % 100) / 1000; // Around 90°E ± 0.1°
  
  return { 
    lat: fallbackLat, 
    lon: fallbackLon,
    source: 'fallback',
    name: locationName
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Fetch driving route between two coordinates using the public OSRM API.
 * Falls back to straight-line (Haversine) distance if the API fails.
 * @param {{lat:number, lon:number}} startCoords
 * @param {{lat:number, lon:number}} endCoords
 * @returns {Promise<{distanceKm:number, coordinates:Array<{lat:number,lon:number}>, source:string, durationSec:number|null}>}
 */
export async function getRouteBetweenCoordinates(startCoords, endCoords) {
  const startLat = parseFloat(startCoords.lat);
  const startLon = parseFloat(startCoords.lon);
  const endLat = parseFloat(endCoords.lat);
  const endLon = parseFloat(endCoords.lon);

  const fallbackResult = () => ({
    distanceKm: calculateDistance(startLat, startLon, endLat, endLon),
    coordinates: [
      { lat: startLat, lon: startLon },
      { lat: endLat, lon: endLon },
    ],
    source: "haversine-fallback",
    durationSec: null,
  });

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;
    const response = await fetch(url);

    if (!response.ok) {
      return fallbackResult();
    }

    const data = await response.json();
    const route = data?.routes?.[0];

    if (!route || !route.geometry?.coordinates) {
      return fallbackResult();
    }

    const coordinates = route.geometry.coordinates.map(([lon, lat]) => ({
      lat,
      lon,
    }));

    const distanceKm = Math.round((route.distance / 1000) * 100) / 100;

    return {
      distanceKm,
      coordinates,
      source: "osrm",
      durationSec: route.duration ?? null,
    };
  } catch (error) {
    console.warn("Route API error, using fallback distance.", error);
    return fallbackResult();
  }
}
