import { useState } from 'react'
import Header from './components/Header'
import InputForm from './components/InputForm'
import ResultsPanel from './components/ResultsPanel'
import OptimizationSuggestions from './components/OptimizationSuggestions'
import SimulationChart from './components/SimulationChart'
import ScenarioComparison from './components/ScenarioComparison'
import { runSimulation } from './utils/calculations'

const initialFormData = {
  startLocation: '',
  destination: '',
  vehicleType: '',
  fuelType: '',
  loadAmount: '',
  numTrips: ''
}

function App() {
  const [formData, setFormData] = useState(initialFormData)
  const [results, setResults] = useState(null)
  const [scenario1, setScenario1] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsCalculating(true)
    
    // Run simulation calculations
    try {
      const simulationResults = runSimulation(formData)
      setResults(simulationResults)
    } catch (error) {
      console.error('Calculation error:', error)
      alert('An error occurred during calculation. Please check your inputs.')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSaveScenario = () => {
    if (results) {
      setScenario1({ ...results, formData: { ...formData } })
      alert('Scenario 1 saved! Run another simulation to compare.')
    }
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setResults(null)
    setScenario1(null)
  }

  // Determine scenario 2 from current results
  const scenario2 = results ? { ...results, formData: { ...formData } } : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <InputForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isCalculating={isCalculating}
            />
          </div>
          <div className="space-y-6">
            <ResultsPanel results={results} formData={formData} />
            {results && (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveScenario}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
                >
                  Save as Scenario 1
                </button>
              </div>
            )}
            <OptimizationSuggestions suggestions={results?.optimizationSuggestions} />
          </div>
        </div>

        {/* Chart Section */}
        {results && (
          <div className="mb-8">
            <SimulationChart results={results} />
          </div>
        )}

        {/* Scenario Comparison Section */}
        {scenario1 && scenario2 && (
          <div className="mb-8">
            <ScenarioComparison scenario1={scenario1} scenario2={scenario2} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App

