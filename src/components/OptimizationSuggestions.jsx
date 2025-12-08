import { motion } from 'framer-motion'
import { FaLightbulb, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa'

function OptimizationSuggestions({ suggestions }) {
  if (!suggestions || suggestions.totalSuggestions === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <FaLightbulb className="text-yellow-500 text-2xl" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Optimization Suggestions
          </h2>
        </div>
        <div className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">
              {suggestions ? 'No suggestions available for this simulation' : 'Suggestions will appear here after running a simulation'}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50'
      case 'medium':
        return 'border-yellow-300 bg-yellow-50'
      case 'low':
        return 'border-blue-300 bg-blue-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FaExclamationCircle className="text-red-600" />
      case 'medium':
        return <FaInfoCircle className="text-yellow-600" />
      case 'low':
        return <FaLightbulb className="text-blue-600" />
      default:
        return <FaLightbulb className="text-gray-600" />
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">High Priority</span>
      case 'medium':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium Priority</span>
      case 'low':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Low Priority</span>
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <FaLightbulb className="text-yellow-500 text-2xl" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Optimization Suggestions
        </h2>
      </div>
      <div className="space-y-4">
        {suggestions.suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border-l-4 rounded-lg p-4 shadow-sm ${getPriorityColor(suggestion.priority)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {getPriorityIcon(suggestion.priority)}
                <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
              </div>
              {getPriorityBadge(suggestion.priority)}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed ml-7">{suggestion.message}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default OptimizationSuggestions

