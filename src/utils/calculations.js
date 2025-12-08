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
 * Calculate distance between two locations using Haversine formula
 * @param {string} startLocation - Starting location name
 * @param {string} destination - Destination location name
 * @returns {number} Distance in kilometers
 */
export function getDistance(startLocation, destination) {
  const start = normalizeLocationName(startLocation);
  const dest = normalizeLocationName(destination);

  const startCoords = LOCATIONS[start];
  const destCoords = LOCATIONS[dest];

  // If locations not found in dictionary, return a default distance
  if (!startCoords || !destCoords) {
    // Default fallback: assume 100km for unknown locations
    return 100;
  }

  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(destCoords.lat - startCoords.lat);
  const dLon = toRadians(destCoords.lon - startCoords.lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(startCoords.lat)) *
      Math.cos(toRadians(destCoords.lat)) *
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
 * Get fuel efficiency (km per liter) based on vehicle type
 * @param {string} vehicleType - Type of vehicle
 * @returns {number} Kilometers per liter
 */
function getKmPerLiter(vehicleType) {
  const efficiencyMap = {
    motorcycle: 40,
    car: 15, // Average car efficiency
    van: 12,
    "truck-small": 8, // Mini-truck
    "truck-large": 6, // Large truck
    // Alternative mappings
    motorbike: 40,
    "cng-3-wheeler": 25,
    "mini-truck": 8,
    pickup: 10,
  };

  return efficiencyMap[vehicleType] || 12; // Default to van efficiency
}

/**
 * Calculate fuel consumption
 * @param {number} distance - Distance in km
 * @param {string} vehicleType - Type of vehicle
 * @param {number} numberOfTrips - Number of trips
 * @returns {number} Fuel consumed in liters (or kg for CNG)
 */
export function calculateFuelConsumption(distance, vehicleType, numberOfTrips) {
  const kmPerLiter = getKmPerLiter(vehicleType);
  const fuelUsed = (distance / kmPerLiter) * numberOfTrips;
  return Math.round(fuelUsed * 100) / 100; // Round to 2 decimal places
}

/**
 * Get CO₂ emission factor based on fuel type
 * @param {string} fuelType - Type of fuel
 * @returns {number} Emission factor in kg CO₂ per liter (or kg for CNG)
 */
function getEmissionFactor(fuelType) {
  const emissionFactors = {
    petrol: 2.31,
    diesel: 2.68,
    cng: 2.75,
    octane: 2.39,
    electric: 0, // Electric vehicles have zero direct emissions
  };

  return emissionFactors[fuelType] || 2.31; // Default to petrol
}

/**
 * Calculate CO₂ emissions
 * @param {number} fuelUsed - Fuel consumed in liters (or kg for CNG)
 * @param {string} fuelType - Type of fuel
 * @returns {number} CO₂ emissions in kg
 */
export function calculateCO2Emissions(fuelUsed, fuelType) {
  const emissionFactor = getEmissionFactor(fuelType);
  const co2 = fuelUsed * emissionFactor;
  return Math.round(co2 * 100) / 100; // Round to 2 decimal places
}

/**
 * Get fuel price based on fuel type (Bangladesh prices in BDT)
 * @param {string} fuelType - Type of fuel
 * @returns {number} Price per liter (or per cubic meter for CNG)
 */
function getFuelPrice(fuelType) {
  const fuelPrices = {
    petrol: 125, // BDT per liter
    diesel: 110, // BDT per liter
    cng: 43, // BDT per cubic meter
    octane: 135, // BDT per liter (approximate)
    electric: 0, // Not applicable for direct fuel cost
  };

  return fuelPrices[fuelType] || 125; // Default to petrol
}

/**
 * Calculate total fuel cost
 * @param {number} fuelUsed - Fuel consumed in liters (or cubic meters for CNG)
 * @param {string} fuelType - Type of fuel
 * @returns {number} Total cost in BDT
 */
export function calculateFuelCost(fuelUsed, fuelType) {
  const fuelPrice = getFuelPrice(fuelType);
  const cost = fuelUsed * fuelPrice;
  return Math.round(cost * 100) / 100; // Round to 2 decimal places
}

/**
 * Generate optimization suggestions based on input parameters and results
 * @param {Object} params - Parameters object
 * @param {number} params.numberOfTrips - Number of trips
 * @param {number} params.co2Emissions - CO₂ emissions in kg
 * @param {string} params.fuelType - Type of fuel
 * @param {string} params.vehicleType - Type of vehicle
 * @param {number} params.loadAmount - Load amount in kg
 * @returns {Object} Suggestions object with recommendations
 */
export function generateOptimizationSuggestions(params) {
  const { numberOfTrips, co2Emissions, fuelType, vehicleType, loadAmount } =
    params;
  const suggestions = [];

  // Suggest load consolidation if multiple trips
  if (numberOfTrips > 1) {
    suggestions.push({
      type: "load-consolidation",
      title: "Load Consolidation",
      message: `You're making ${numberOfTrips} trips. Consider consolidating your deliveries into fewer trips to reduce fuel consumption and emissions.`,
      priority: "high",
    });
  }

  // Suggest route optimization if high CO₂ emissions
  if (co2Emissions > 20) {
    suggestions.push({
      type: "route-optimization",
      title: "Route Optimization",
      message: `Your CO₂ emissions are ${co2Emissions.toFixed(
        2
      )} kg. Consider optimizing your route or using multiple drop-off points to reduce total distance.`,
      priority: "high",
    });
  }

  // Suggest fuel switching from diesel
  if (fuelType === "diesel") {
    suggestions.push({
      type: "fuel-switch",
      title: "Consider Alternative Fuels",
      message:
        "Diesel has high emissions. Consider switching to CNG or Octane for lower CO₂ emissions and potentially lower costs.",
      priority: "medium",
    });
  }

  // Suggest vehicle type optimization
  if (vehicleType === "truck-small" || vehicleType === "mini-truck") {
    const loadAmountNum = parseFloat(loadAmount) || 0;
    if (loadAmountNum < 500) {
      suggestions.push({
        type: "vehicle-optimization",
        title: "Vehicle Size Optimization",
        message: `Your load is ${loadAmountNum} kg. For lighter loads, consider using a pickup or van instead of a mini-truck to improve fuel efficiency.`,
        priority: "medium",
      });
    }
  }

  // Suggest electric vehicle for frequent trips
  if (numberOfTrips > 5 && co2Emissions > 30) {
    suggestions.push({
      type: "electric-vehicle",
      title: "Consider Electric Vehicles",
      message:
        "For frequent deliveries, electric vehicles could significantly reduce your carbon footprint and operating costs.",
      priority: "low",
    });
  }

  return {
    suggestions,
    totalSuggestions: suggestions.length,
  };
}

/**
 * Run complete simulation calculation
 * @param {Object} formData - Form data object
 * @returns {Object} Complete simulation results
 */
export function runSimulation(formData) {
  const {
    startLocation,
    destination,
    vehicleType,
    fuelType,
    loadAmount,
    numTrips,
  } = formData;

  // Calculate distance
  const distance = getDistance(startLocation, destination);

  // Calculate fuel consumption
  const fuelUsed = calculateFuelConsumption(
    distance,
    vehicleType,
    parseInt(numTrips)
  );

  // Calculate CO₂ emissions
  const co2Emissions = calculateCO2Emissions(fuelUsed, fuelType);

  // Calculate fuel cost
  const fuelCost = calculateFuelCost(fuelUsed, fuelType);

  // Generate optimization suggestions
  const optimizationSuggestions = generateOptimizationSuggestions({
    numberOfTrips: parseInt(numTrips),
    co2Emissions,
    fuelType,
    vehicleType,
    loadAmount,
  });

  return {
    distance,
    fuelUsed,
    co2Emissions,
    fuelCost,
    optimizationSuggestions,
    vehicleType,
    fuelType,
  };
}
