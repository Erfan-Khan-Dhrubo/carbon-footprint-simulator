import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaTruck,
  FaGasPump,
  FaBox,
  FaRoute,
  FaRedo,
} from "react-icons/fa";

function InputForm({
  formData,
  onInputChange,
  onSubmit,
  onReset,
  isCalculating = false,
  isGeocoding = false,
}) {
  const vehicleTypes = [
    { value: "", label: "Select vehicle type" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "car", label: "Car" },
    { value: "van", label: "Van" },
    { value: "truck-small", label: "Small Truck" },
    { value: "truck-large", label: "Large Truck" },
  ];

  const fuelTypes = [
    { value: "", label: "Select fuel type" },
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "cng", label: "CNG" },
    { value: "electric", label: "Electric" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Delivery Information
        </h2>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FaRedo className="text-sm" />
            Reset
          </button>
        )}
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="startLocation"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <FaMapMarkerAlt className="text-blue-600" />
            Start Location
          </label>
          <input
            type="text"
            id="startLocation"
            name="startLocation"
            value={formData.startLocation}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter start location"
            required
          />
        </div>

        <div>
          <label
            htmlFor="destination"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <FaRoute className="text-green-600" />
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter destination"
            required
          />
        </div>

        <div>
          <label
            htmlFor="vehicleType"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <FaTruck className="text-purple-600" />
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            required
          >
            {vehicleTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="fuelType"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <FaGasPump className="text-orange-600" />
            Fuel Type
          </label>
          <select
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            required
          >
            {fuelTypes.map((fuel) => (
              <option key={fuel.value} value={fuel.value}>
                {fuel.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="loadAmount"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <FaBox className="text-yellow-600" />
            Load Amount (kg)
          </label>
          <input
            type="number"
            id="loadAmount"
            name="loadAmount"
            value={formData.loadAmount}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter load amount in kg"
            min="0"
            step="0.1"
            required
          />
        </div>

        <div>
          <label
            htmlFor="numTrips"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Number of Trips
          </label>
          <input
            type="number"
            id="numTrips"
            name="numTrips"
            value={formData.numTrips}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter number of trips"
            min="1"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={isCalculating || isGeocoding}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isGeocoding
            ? "Fetching Coordinates..."
            : isCalculating
            ? "Calculating..."
            : "Run Simulation"}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default InputForm;
