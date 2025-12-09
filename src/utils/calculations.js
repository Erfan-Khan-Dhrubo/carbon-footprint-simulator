// How far a vehicle can go using 1 liter of fuel (km per liter)
const EFFICIENCY_MAP = {
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

// How much CO₂ is emitted when 1 liter (or kg) of fuel is burned (kg CO₂ per liter of fuel)
const EMISSION_FACTORS = {
  petrol: 2.31,
  diesel: 2.68,
  octane: 2.39,
  cng: 2.75,
  electric: 0,
};

// Fuel prices (BDT per liter)
const FUEL_PRICES = {
  petrol: 120,
  diesel: 115,
  octane: 130,
  cng: 85,
  electric: 8,
};

// Vehicle carrying capacity (kg)
const CAPACITY_MAP = {
  motorcycle: 50,
  car: 500,
  van: 1000,
  pickup: 900,
  "truck-small": 2000,
  "truck-large": 5000,
};

// Default fallback values
const DEFAULTS = {
  kmPerLiter: 12,
  emissionFactor: 2.31,
  fuelPrice: 115,
  vehicleCapacity: 1000,
  distance: 100,
};

// Convert input to number safely
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// Round values to 2 decimals
const round2 = (value) => Math.round(value * 100) / 100;

// Get default distance
export function getDistance() {
  return DEFAULTS.distance;
}

// get km per liter
function getKmPerLiter(vehicleType) {
  return EFFICIENCY_MAP[vehicleType] ?? DEFAULTS.kmPerLiter;
}

// calculate fuel consumption
export function calculateFuelConsumption(distance, vehicleType, numberOfTrips) {
  const kmPerLiter = getKmPerLiter(vehicleType);
  return round2((distance / kmPerLiter) * numberOfTrips);
}

// get emission factor
function getEmissionFactor(fuelType) {
  return EMISSION_FACTORS[fuelType] ?? DEFAULTS.emissionFactor;
}

// calculate co2 emissions
export function calculateCO2Emissions(
  fuelUsed,
  fuelType,
  loadAmount = 0,
  vehicleCapacity = DEFAULTS.vehicleCapacity
) {
  const emissionFactor = getEmissionFactor(fuelType);
  const loadUtilization =
    loadAmount > 0 && vehicleCapacity > 0 ? loadAmount / vehicleCapacity : 0;
  const loadFactor = 1 + 0.2 * loadUtilization;

  return round2(fuelUsed * emissionFactor * loadFactor);
}

// get fuel price
function getFuelPrice(fuelType) {
  return FUEL_PRICES[fuelType] ?? DEFAULTS.fuelPrice;
}

// calculate fuel cost
export function calculateFuelCost(fuelUsed, fuelType) {
  return round2(fuelUsed * getFuelPrice(fuelType));
}

// generate optimization suggestions
export function generateOptimizationSuggestions({
  numberOfTrips,
  co2Emissions,
  fuelType,
  vehicleType,
  loadAmount,
}) {
  const trips = toNumber(numberOfTrips);
  const emissions = toNumber(co2Emissions);
  const loadNum = toNumber(loadAmount);

  const suggestions = [];

  if (trips > 1) {
    suggestions.push({
      type: "load-consolidation",
      title: "Load Consolidation",
      message: `You made ${trips} trips. Consolidating trips can reduce fuel and emissions.`,
      priority: "high",
    });
  }

  if (emissions > 20) {
    suggestions.push({
      type: "route-optimization",
      title: "Optimize Your Route",
      message: `Your emissions are ${emissions} kg. Optimized routes reduce distance and cost.`,
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
    if (loadNum < 500) {
      suggestions.push({
        type: "vehicle-optimization",
        title: "Smaller Vehicle Suggested",
        message: `${loadNum} kg is low weight—use a pickup/van for better efficiency.`,
        priority: "medium",
      });
    }
  }

  if (trips > 5 && emissions > 30) {
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

// get vehicle capacity
function getVehicleCapacity(vehicleType) {
  return CAPACITY_MAP[vehicleType] ?? DEFAULTS.vehicleCapacity;
}

// run simulation
export function runSimulation(formData, providedDistance = null) {
  const {
    startLocation,
    destination,
    vehicleType,
    fuelType,
    loadAmount,
    vehicleCapacity,
    numTrips,
  } = formData;

  const trips = toNumber(numTrips, 0);
  const distance = providedDistance ?? getDistance(startLocation, destination);
  const fuelUsed = calculateFuelConsumption(distance, vehicleType, trips);

  const loadAmountNum = toNumber(loadAmount);
  const capacityOverride = toNumber(vehicleCapacity);
  const resolvedVehicleCapacity =
    capacityOverride > 0 ? capacityOverride : getVehicleCapacity(vehicleType);

  const co2Emissions = calculateCO2Emissions(
    fuelUsed,
    fuelType,
    loadAmountNum,
    resolvedVehicleCapacity
  );

  const fuelCost = calculateFuelCost(fuelUsed, fuelType);

  const optimizationSuggestions = generateOptimizationSuggestions({
    numberOfTrips: trips,
    co2Emissions,
    fuelType,
    vehicleType,
    loadAmount: loadAmountNum,
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
    vehicleCapacity: resolvedVehicleCapacity,
  };
}
