import { useState } from 'react'
import Header from './components/Header'
import InputForm from './components/InputForm'
import ResultsPanel from './components/ResultsPanel'
import OptimizationSuggestions from './components/OptimizationSuggestions'
import SimulationChart from './components/SimulationChart'
import ScenarioComparison from './components/ScenarioComparison'
import RouteMap from './components/RouteMap'
import { runSimulation } from './utils/calculations'
import { getCoordinates, calculateDistance } from './utils/geocoding'

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
  const [isGeocoding, setIsGeocoding] = useState(false)
  
  // Consolidated route state
  const [routeData, setRouteData] = useState({
    startCoords: null,
    endCoords: null,
    distance: null,
    startName: null,
    endName: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsCalculating(true)
    setIsGeocoding(true)
    
    // Reset route data
    setRouteData({
      startCoords: null,
      endCoords: null,
      distance: null,
      startName: null,
      endName: null,
    })
    setResults(null)
    
    try {
      // Step 1: Read start and end location inputs from UI
      const startLocationInput = formData.startLocation.trim()
      const endLocationInput = formData.destination.trim()
      
      if (!startLocationInput || !endLocationInput) {
        throw new Error('Please provide both start and end locations')
      }
      
      // Step 2: Convert addresses to coordinates using Nominatim API
      const startCoordsData = await getCoordinates(startLocationInput)
      const endCoordsData = await getCoordinates(endLocationInput)
      
      setIsGeocoding(false)
      
      // Step 3: Calculate distance using the coordinates
      const distance = calculateDistance(
        startCoordsData.lat,
        startCoordsData.lon,
        endCoordsData.lat,
        endCoordsData.lon
      )
      
      // Step 4: Update React state with route data
      setRouteData({
        startCoords: { lat: startCoordsData.lat, lon: startCoordsData.lon },
        endCoords: { lat: endCoordsData.lat, lon: endCoordsData.lon },
        distance: distance,
        startName: startCoordsData.name || startLocationInput,
        endName: endCoordsData.name || endLocationInput,
      })
      
      // Step 5: Run simulation calculations with the calculated distance
      const simulationResults = runSimulation(formData, distance)
      setResults(simulationResults)
      
    } catch (error) {
      console.error('Error during simulation:', error)
      setIsGeocoding(false)
      alert(`An error occurred: ${error.message || 'Please check your inputs and try again.'}`)
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
    setRouteData({
      startCoords: null,
      endCoords: null,
      distance: null,
      startName: null,
      endName: null,
    })
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
              isGeocoding={isGeocoding}
            />
          </div>
          <div className="space-y-6">
            <ResultsPanel results={results} formData={formData} />
            <OptimizationSuggestions suggestions={results?.optimizationSuggestions} />
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
          </div>
        </div>

        {/* Loading state for geocoding */}
        {isGeocoding && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Fetching coordinates for locations...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Section - Only show after coordinates are fetched and simulation completes */}
        {results && routeData.startCoords && routeData.endCoords && !isGeocoding && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Route Map
              </h2>
              <RouteMap
                startCoords={routeData.startCoords}
                endCoords={routeData.endCoords}
                distance={routeData.distance}
                startName={routeData.startName}
                endName={routeData.endName}
              />
              {routeData.distance && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Route Distance:</span>{' '}
                      {routeData.distance} km
                    </p>
                    {routeData.startName && routeData.endName && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">From:</span> {routeData.startName} → 
                        <span className="font-medium"> To:</span> {routeData.endName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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

