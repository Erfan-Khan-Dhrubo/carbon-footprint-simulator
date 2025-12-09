import { motion } from 'framer-motion'
import { FaArrowRight, FaArrowDown, FaEquals } from 'react-icons/fa'
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function ScenarioComparison({ scenario1, scenario2 }) {
  if (!scenario1 || !scenario2) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Scenario Comparison
        </h2>
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            Run two simulations to compare scenarios
          </p>
        </div>
      </div>
    )
  }

  const calculateDifference = (val1, val2) => {
    const diff = val2 - val1
    const percentChange = val1 !== 0 ? ((diff / val1) * 100).toFixed(1) : 0
    return { diff, percentChange }
  }

  const co2Diff = calculateDifference(scenario1.co2Emissions, scenario2.co2Emissions)
  const fuelDiff = calculateDifference(scenario1.fuelUsed, scenario2.fuelUsed)
  const costDiff = calculateDifference(scenario1.fuelCost, scenario2.fuelCost)
  const distanceDiff = calculateDifference(scenario1.distance, scenario2.distance)

  const getDiffIcon = (diff) => {
    if (diff > 0) return <FaArrowRight className="text-red-500" />
    if (diff < 0) return <FaArrowDown className="text-green-500" />
    return <FaEquals className="text-gray-500" />
  }

  const getDiffColor = (diff) => {
    if (diff > 0) return 'text-red-600'
    if (diff < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const metrics = [
    { label: 'Distance (km)', key: 'distance' },
    { label: 'Fuel Used', key: 'fuelUsed' },
    { label: 'CO₂ (kg)', key: 'co2Emissions' },
    { label: 'Cost (BDT)', key: 'fuelCost' },
  ]

  const chartData = {
    labels: metrics.map((m) => m.label),
    datasets: [
      {
        label: 'Scenario 1',
        data: metrics.map((m) => scenario1[m.key]),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1.5,
      },
      {
        label: 'Scenario 2',
        data: metrics.map((m) => scenario2[m.key]),
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 1.5,
      },
    ],
  }

  const tooltipForMetric = (metric, scenario) => {
    if (metric.key === 'distance') return `${scenario.distance} km`
    if (metric.key === 'fuelUsed') {
      const unit = scenario.fuelType === 'cng' ? 'kg' : 'L'
      return `${scenario.fuelUsed} ${unit}`
    }
    if (metric.key === 'co2Emissions') return `${scenario.co2Emissions} kg`
    if (metric.key === 'fuelCost')
      return `৳${scenario.fuelCost.toLocaleString('en-BD')} BDT`
    return scenario[metric.key]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const scenario = context.datasetIndex === 0 ? scenario1 : scenario2
            const metric = metrics[context.dataIndex]
            return `${context.dataset.label}: ${tooltipForMetric(metric, scenario)}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
        Scenario Comparison
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Scenario 1</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Scenario 2</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Difference</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Change</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-800">Distance (km)</td>
              <td className="py-3 px-4 text-right">{scenario1.distance}</td>
              <td className="py-3 px-4 text-right">{scenario2.distance}</td>
              <td className={`py-3 px-4 text-right font-semibold ${getDiffColor(distanceDiff.diff)}`}>
                {distanceDiff.diff > 0 ? '+' : ''}{distanceDiff.diff.toFixed(2)} km
              </td>
              <td className="py-3 px-4 text-center">
                {getDiffIcon(distanceDiff.diff)}
                <span className={`ml-1 text-xs ${getDiffColor(distanceDiff.diff)}`}>
                  {distanceDiff.percentChange > 0 ? '+' : ''}{distanceDiff.percentChange}%
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-800">Fuel Used</td>
              <td className="py-3 px-4 text-right">
                {scenario1.fuelUsed} {scenario1.fuelType === 'cng' ? 'kg' : 'L'}
              </td>
              <td className="py-3 px-4 text-right">
                {scenario2.fuelUsed} {scenario2.fuelType === 'cng' ? 'kg' : 'L'}
              </td>
              <td className={`py-3 px-4 text-right font-semibold ${getDiffColor(fuelDiff.diff)}`}>
                {fuelDiff.diff > 0 ? '+' : ''}{fuelDiff.diff.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-center">
                {getDiffIcon(fuelDiff.diff)}
                <span className={`ml-1 text-xs ${getDiffColor(fuelDiff.diff)}`}>
                  {fuelDiff.percentChange > 0 ? '+' : ''}{fuelDiff.percentChange}%
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-800">CO₂ Emissions (kg)</td>
              <td className="py-3 px-4 text-right">{scenario1.co2Emissions}</td>
              <td className="py-3 px-4 text-right">{scenario2.co2Emissions}</td>
              <td className={`py-3 px-4 text-right font-semibold ${getDiffColor(co2Diff.diff)}`}>
                {co2Diff.diff > 0 ? '+' : ''}{co2Diff.diff.toFixed(2)} kg
              </td>
              <td className="py-3 px-4 text-center">
                {getDiffIcon(co2Diff.diff)}
                <span className={`ml-1 text-xs ${getDiffColor(co2Diff.diff)}`}>
                  {co2Diff.percentChange > 0 ? '+' : ''}{co2Diff.percentChange}%
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-800">Total Cost (BDT)</td>
              <td className="py-3 px-4 text-right">৳{scenario1.fuelCost.toLocaleString('en-BD')}</td>
              <td className="py-3 px-4 text-right">৳{scenario2.fuelCost.toLocaleString('en-BD')}</td>
              <td className={`py-3 px-4 text-right font-semibold ${getDiffColor(costDiff.diff)}`}>
                {costDiff.diff > 0 ? '+' : ''}৳{costDiff.diff.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-center">
                {getDiffIcon(costDiff.diff)}
                <span className={`ml-1 text-xs ${getDiffColor(costDiff.diff)}`}>
                  {costDiff.percentChange > 0 ? '+' : ''}{costDiff.percentChange}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Summary:</strong> Scenario 2 shows a{' '}
          <span className={getDiffColor(co2Diff.diff)}>
            {Math.abs(co2Diff.percentChange)}% {co2Diff.diff > 0 ? 'increase' : 'decrease'}
          </span>{' '}
          in CO₂ emissions compared to Scenario 1.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Simulation Overview (Comparison)
        </h3>
        <div className="h-72">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </motion.div>
  )
}

export default ScenarioComparison

