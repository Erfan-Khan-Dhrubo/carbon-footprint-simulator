import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { motion } from 'framer-motion'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function SimulationChart({ results }) {
  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Simulation Chart
        </h2>
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Run a simulation to see the chart</p>
        </div>
      </div>
    )
  }

  const getFuelUnit = (fuelType) => {
    return fuelType === 'cng' ? 'kg' : 'L'
  }

  const chartData = {
    labels: ['Distance (km)', 'Fuel Used', 'CO₂ (kg)', 'Cost (BDT)'],
    datasets: [
      {
        label: 'Values',
        data: [
          results.distance,
          results.fuelUsed,
          results.co2Emissions,
          results.fuelCost / 100, // Scale cost for better visualization
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue for distance
          'rgba(251, 146, 60, 0.8)', // Orange for fuel
          'rgba(34, 197, 94, 0.8)', // Green for CO2
          'rgba(234, 179, 8, 0.8)', // Yellow for cost
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const value = context.parsed.y || 0
            if (label === 'Distance (km)') {
              return `Distance: ${results.distance} km`
            } else if (label === 'Fuel Used') {
              return `Fuel: ${results.fuelUsed} ${getFuelUnit(results.fuelType)}`
            } else if (label === 'CO₂ (kg)') {
              return `CO₂: ${results.co2Emissions} kg`
            } else if (label === 'Cost (BDT)') {
              return `Cost: ৳${results.fuelCost.toLocaleString('en-BD')} BDT`
            }
            return `${label}: ${value}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toFixed(1)
          },
        },
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Simulation Overview
      </h2>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Distance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-gray-600">Fuel</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">CO₂</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">Cost</span>
        </div>
      </div>
    </motion.div>
  )
}

export default SimulationChart

