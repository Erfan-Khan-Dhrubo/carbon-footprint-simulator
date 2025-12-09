/**
 * Calculate distance between two locations (fallback function)
 * @param {string} startLocation
 * @param {string} destination
 * @returns {number} Distance in km
 */
export function getDistance(startLocation, destination) {
  return 100; // fallback
}

/* ------------------ FUEL EFFICIENCY ------------------ */
function getKmPerLiter(vehicleType) {
  const efficiencyMap = {
    motorcycle: 40,
    motorbike: 40,
    car: 15,
    van: 12,
    pickup: 10,
    "cng-3-wheeler": 25,
    "truck-small": 8,
    "truck-large": 6,
    "mini-truck": 8,
  };

  return efficiencyMap[vehicleType] || 12; // Default van
}

/**
 * Fuel Consumption
 */
export function calculateFuelConsumption(distance, vehicleType, numberOfTrips) {
  const kmPerLiter = getKmPerLiter(vehicleType);
  const fuelUsed = (distance / kmPerLiter) * numberOfTrips;
  return Math.round(fuelUsed * 100) / 100;
}

/* ------------------ EMISSION FACTOR ------------------ */
function getEmissionFactor(fuelType) {
  const emissionFactors = {
    petrol: 2.31,
    diesel: 2.68,
    octane: 2.39,
    cng: 2.75,
    electric: 0,
  };

  return emissionFactors[fuelType] || 2.31;
}

export function calculateCO2Emissions(
  fuelUsed,
  fuelType,
  loadAmount = 0,
  vehicleCapacity = 1000
) {
  const emissionFactor = getEmissionFactor(fuelType);

  // LOAD FACTOR FIX (previously missing)
  let loadFactor = 1.0;

  if (loadAmount > 0 && vehicleCapacity > 0) {
    const loadUtilization = loadAmount / vehicleCapacity;
    loadFactor = 1 + 0.2 * loadUtilization; // Add up to +20% emissions at full load
  }

  const co2 = fuelUsed * emissionFactor * loadFactor;
  return Math.round(co2 * 100) / 100;
}

/* ------------------ FUEL COST ------------------ */
function getFuelPrice(fuelType) {
  const fuelPrices = {
    petrol: 120,
    diesel: 115,
    octane: 130,
    cng: 85,
    electric: 8,
  };

  return fuelPrices[fuelType] || 115;
}

export function calculateFuelCost(fuelUsed, fuelType) {
  const fuelPrice = getFuelPrice(fuelType);
  return Math.round(fuelUsed * fuelPrice * 100) / 100;
}

/* ------------------ OPTIMIZATION SUGGESTIONS ------------------ */
export function generateOptimizationSuggestions(params) {
  const { numberOfTrips, co2Emissions, fuelType, vehicleType, loadAmount } =
    params;

  const suggestions = [];

  if (numberOfTrips > 1) {
    suggestions.push({
      type: "load-consolidation",
      title: "Load Consolidation",
      message: `You made ${numberOfTrips} trips. Consolidating trips can reduce fuel and emissions.`,
      priority: "high",
    });
  }

  if (co2Emissions > 20) {
    suggestions.push({
      type: "route-optimization",
      title: "Optimize Your Route",
      message: `Your emissions are ${co2Emissions} kg. Optimized routes reduce distance and cost.`,
      priority: "high",
    });
  }

  if (fuelType === "diesel") {
    suggestions.push({
      type: "fuel-switch",
      title: "Switch Fuel",
      message: "Diesel is high emission. Switching to CNG/Octane reduces CO₂.",
      priority: "medium",
    });
  }

  if (vehicleType === "truck-small" || vehicleType === "mini-truck") {
    const loadNum = parseFloat(loadAmount) || 0;
    if (loadNum < 500) {
      suggestions.push({
        type: "vehicle-optimization",
        title: "Smaller Vehicle Suggested",
        message: `${loadNum} kg is low weight—use a pickup/van for better efficiency.`,
        priority: "medium",
      });
    }
  }

  if (numberOfTrips > 5 && co2Emissions > 30) {
    suggestions.push({
      type: "electric-vehicle",
      title: "Consider Electric Vehicles",
      message:
        "Frequent delivery cycles benefit greatly from EVs for lower emissions.",
      priority: "low",
    });
  }

  return {
    suggestions,
    totalSuggestions: suggestions.length,
  };
}

/* ------------------ VEHICLE CAPACITY ------------------ */
function getVehicleCapacity(vehicleType) {
  const capacityMap = {
    motorcycle: 50,
    car: 500,
    van: 1000,
    pickup: 900,
    "truck-small": 2000,
    "truck-large": 5000,
  };

  return capacityMap[vehicleType] || 1000;
}

/* ------------------ RUN SIMULATION ------------------ */
export function runSimulation(formData, providedDistance = null) {
  const {
    startLocation,
    destination,
    vehicleType,
    fuelType,
    loadAmount,
    numTrips,
  } = formData;

  const distance =
    providedDistance !== null
      ? providedDistance
      : getDistance(startLocation, destination);

  const fuelUsed = calculateFuelConsumption(
    distance,
    vehicleType,
    parseInt(numTrips)
  );

  const loadAmountNum = parseFloat(loadAmount) || 0;
  const vehicleCapacity = getVehicleCapacity(vehicleType);

  const co2Emissions = calculateCO2Emissions(
    fuelUsed,
    fuelType,
    loadAmountNum,
    vehicleCapacity
  );

  /** FIXED ISSUE #1: FUEL COST LINE */
  const fuelCost = calculateFuelCost(fuelUsed, fuelType);

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
