/**
 * Calculate distance between two locations (fallback function)
 * Note: This is only used as a fallback when geocoding fails.
 * In normal operation, distance is calculated via geocoding API.
 * @param {string} startLocation - Starting location name
 * @param {string} destination - Destination location name
 * @returns {number} Distance in kilometers (default: 100km)
 */
export function getDistance(startLocation, destination) {
  // Default fallback: return 100km for unknown locations
  // This function is rarely used since distance is typically provided via geocoding
  return 100;
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
 * @param {number} loadAmount - Load amount in kg (default: 0)
 * @param {number} vehicleCapacity - Vehicle capacity in kg (default: 1000)
 * @returns {number} CO₂ emissions in kg
 */
export function calculateCO2Emissions(
  fuelUsed,
  fuelType,
  loadAmount = 0,
  vehicleCapacity = 1000
) {
  const emissionFactor = getEmissionFactor(fuelType);

  let loadFactor = 1.0;
  if (loadAmount > 0 && vehicleCapacity > 0) {
    const loadUtilization = loadAmount / vehicleCapacity;
    loadFactor = 1 + 0.2 * loadUtilization;
  }

  const co2 = fuelUsed * loadFactor * emissionFactor;
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
 * Get vehicle capacity based on vehicle type
 * @param {string} vehicleType - Type of vehicle
 * @returns {number} Vehicle capacity in kg
 */
function getVehicleCapacity(vehicleType) {
  const capacityMap = {
    motorcycle: 50,
    car: 500,
    van: 1000,
    "truck-small": 2000,
    "truck-large": 5000,
  };
  return capacityMap[vehicleType] || 1000;
}

/**
 * Run complete simulation calculation
 * @param {Object} formData - Form data object
 * @param {number} [providedDistance] - Optional pre-calculated distance in km
 * @returns {Object} Complete simulation results
 */
export function runSimulation(formData, providedDistance = null) {
  const {
    startLocation,
    destination,
    vehicleType,
    fuelType,
    loadAmount,
    numTrips,
  } = formData;

  // Use provided distance if available, otherwise calculate it
  const distance =
    providedDistance !== null
      ? providedDistance
      : getDistance(startLocation, destination);

  // Calculate fuel consumption
  const fuelUsed = calculateFuelConsumption(
    distance,
    vehicleType,
    parseInt(numTrips)
  );

  // Get vehicle capacity and load amount
  const vehicleCapacity = getVehicleCapacity(vehicleType);
  const loadAmountNum = parseFloat(loadAmount) || 0;

  // Calculate CO₂ emissions with load factor
  const co2Emissions = calculateCO2Emissions(
    fuelUsed,
    fuelType,
    loadAmountNum,
    vehicleCapacity
  );

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
    loadAmount: loadAmountNum,
  };
}
