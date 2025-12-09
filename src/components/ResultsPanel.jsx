import { motion } from "framer-motion";
import {
  FaRoute,
  FaGasPump,
  FaCloud,
  FaDollarSign,
  FaFilePdf,
  FaTaxi,
} from "react-icons/fa";
import { exportToPDF } from "../utils/exportUtils";

function ResultsPanel({ results, formData }) {
  const handleExportPDF = () => {
    if (results && formData) {
      exportToPDF(results, formData);
    }
  };

  if (!results) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Simulation Results
        </h2>
        <div className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Run a simulation to see results here</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const getVehicleTypeLabel = (type) => {
    const labels = {
      motorcycle: "Motorcycle",
      car: "Car",
      van: "Van",
      "truck-small": "Small Truck",
      "truck-large": "Large Truck",
    };
    return labels[type] || type;
  };

  const getFuelTypeLabel = (type) => {
    const labels = {
      petrol: "Petrol",
      diesel: "Diesel",
      cng: "CNG",
      electric: "Electric",
      octane: "Octane",
    };
    return labels[type] || type;
  };

  const getFuelUnit = (fuelType) => {
    return fuelType === "cng" ? "kg" : "L";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Simulation Results
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Export to PDF"
          >
            <FaFilePdf className="text-xl" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Distance Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaRoute className="text-blue-600 text-xl" />
              <span className="text-gray-700 font-medium">Distance</span>
            </div>
            <span className="text-2xl font-bold text-blue-900">
              {results.distance} km
            </span>
          </div>
        </motion.div>

        {/* Vehicle & Fuel Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <span className="text-sm text-gray-500 block mb-1">
              Vehicle Type
            </span>
            <span className="text-gray-800 font-semibold">
              {getVehicleTypeLabel(results.vehicleType)}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <span className="text-sm text-gray-500 block mb-1">Fuel Type</span>
            <span className="text-gray-800 font-semibold">
              {getFuelTypeLabel(results.fuelType)}
            </span>
          </motion.div>
        </div>

        {/* Fuel Consumption Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border-l-4 border-orange-500"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaGasPump className="text-orange-600 text-xl" />
              <span className="text-gray-700 font-medium">Fuel Consumed</span>
            </div>
            <span className="text-xl font-bold text-orange-900">
              {results.fuelUsed} {getFuelUnit(results.fuelType)}
            </span>
          </div>
        </motion.div>

        {/* CO₂ Emissions Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-500"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaCloud className="text-green-600 text-xl" />
              <span className="text-gray-700 font-medium">CO₂ Emissions</span>
            </div>
            <span className="text-xl font-bold text-green-900">
              {results.co2Emissions} kg
            </span>
          </div>
        </motion.div>

        {/* Load Utilization Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-500"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaRoute className="text-purple-600 text-xl" />
              <span className="text-gray-700 font-medium">
                Load Utilization
              </span>
            </div>
            <span className="text-xl font-bold text-purple-900">
              {(results.loadAmount / results.vehicleCapacity) * 100}%
            </span>
          </div>
        </motion.div>

        {/* Fuel Cost Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 border-l-4 border-indigo-500"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaTaxi className="text-indigo-600 text-xl" />
              <span className="text-gray-700 font-medium">
                Estimated Fuel Cost
              </span>
            </div>
            <span className="text-xl font-bold text-indigo-900">
              ৳
              {results.fuelCost
                ? results.fuelCost.toLocaleString("en-BD")
                : "0"}{" "}
              BDT
            </span>
          </div>
        </motion.div>

        {/* Total Cost Card */}
        {/*<motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-500"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaDollarSign className="text-yellow-600 text-xl" />
              <span className="text-gray-700 font-medium">Total Fuel Cost</span>
            </div>
            <span className="text-xl font-bold text-yellow-900">
              ৳
              {results.fuelCost
                ? results.fuelCost.toLocaleString("en-BD")
                : "0"}{" "}
              BDT
            </span>
          </div>
        </motion.div> */}
      </div>
    </motion.div>
  );
}

export default ResultsPanel;
