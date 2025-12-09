import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function RouteMap({ startCoords, endCoords, distance, startName, endName }) {
  const mapRef = useRef(null)

  useEffect(() => {
    if (startCoords && endCoords && mapRef.current) {
      // Calculate bounds to fit both markers
      const bounds = L.latLngBounds([startCoords, endCoords])
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [startCoords, endCoords])

  if (!startCoords || !endCoords) {
    return null
  }

  // Create route polyline (straight line for now)
  const routePath = [
    [startCoords.lat, startCoords.lon],
    [endCoords.lat, endCoords.lon],
  ]

  // Calculate center for initial map view
  const centerLat = (startCoords.lat + endCoords.lat) / 2
  const centerLon = (startCoords.lon + endCoords.lon) / 2

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md border border-gray-200">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[startCoords.lat, startCoords.lon]}>
          <Popup>
            <div>
              <strong>Start Location</strong>
              {startName && <div className="text-sm text-gray-600">{startName}</div>}
            </div>
          </Popup>
        </Marker>
        <Marker position={[endCoords.lat, endCoords.lon]}>
          <Popup>
            <div>
              <strong>End Location</strong>
              {endName && <div className="text-sm text-gray-600">{endName}</div>}
            </div>
          </Popup>
        </Marker>
        <Polyline
          positions={routePath}
          color="#3b82f6"
          weight={4}
          opacity={0.7}
        />
      </MapContainer>
    </div>
  )
}

export default RouteMap

