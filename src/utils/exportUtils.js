import jsPDF from 'jspdf'
import Papa from 'papaparse'

/**
 * Export simulation results as PDF
 */
export function exportToPDF(results, formData) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text('SME Delivery Carbon Footprint Report', 105, 20, { align: 'center' })
  
  // Date
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' })
  
  let yPos = 45
  
  // Trip Information
  doc.setFontSize(14)
  doc.text('Trip Information', 20, yPos)
  yPos += 10
  
  doc.setFontSize(10)
  doc.text(`Start Location: ${formData.startLocation}`, 20, yPos)
  yPos += 7
  doc.text(`Destination: ${formData.destination}`, 20, yPos)
  yPos += 7
  doc.text(`Vehicle Type: ${formData.vehicleType}`, 20, yPos)
  yPos += 7
  doc.text(`Fuel Type: ${formData.fuelType}`, 20, yPos)
  yPos += 7
  doc.text(`Load Amount: ${formData.loadAmount} kg`, 20, yPos)
  yPos += 7
  doc.text(`Number of Trips: ${formData.numTrips}`, 20, yPos)
  yPos += 15
  
  // Results
  doc.setFontSize(14)
  doc.text('Simulation Results', 20, yPos)
  yPos += 10
  
  doc.setFontSize(10)
  doc.text(`Distance: ${results.distance} km`, 20, yPos)
  yPos += 7
  doc.text(`Fuel Consumed: ${results.fuelUsed} ${results.fuelType === 'cng' ? 'kg' : 'L'}`, 20, yPos)
  yPos += 7
  doc.text(`CO₂ Emissions: ${results.co2Emissions} kg`, 20, yPos)
  yPos += 7
  doc.text(`Total Cost: ৳${results.fuelCost.toLocaleString('en-BD')} BDT`, 20, yPos)
  yPos += 15
  
  // Optimization Suggestions
  if (results.optimizationSuggestions && results.optimizationSuggestions.totalSuggestions > 0) {
    doc.setFontSize(14)
    doc.text('Optimization Suggestions', 20, yPos)
    yPos += 10
    
    doc.setFontSize(10)
    results.optimizationSuggestions.suggestions.forEach((suggestion, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(`${index + 1}. ${suggestion.title}`, 25, yPos)
      yPos += 6
      doc.setFontSize(8)
      const splitText = doc.splitTextToSize(suggestion.message, 170)
      doc.text(splitText, 30, yPos)
      yPos += splitText.length * 5 + 5
      doc.setFontSize(10)
    })
  }
  
  // Footer
  const pageCount = doc.internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      285,
      { align: 'center' }
    )
  }
  
  doc.save(`carbon-footprint-report-${Date.now()}.pdf`)
}

/**
 * Export simulation results as CSV
 */
export function exportToCSV(results, formData) {
  const data = [
    {
      'Start Location': formData.startLocation,
      'Destination': formData.destination,
      'Vehicle Type': formData.vehicleType,
      'Fuel Type': formData.fuelType,
      'Load Amount (kg)': formData.loadAmount,
      'Number of Trips': formData.numTrips,
      'Distance (km)': results.distance,
      'Fuel Consumed': results.fuelUsed,
      'Fuel Unit': results.fuelType === 'cng' ? 'kg' : 'L',
      'CO₂ Emissions (kg)': results.co2Emissions,
      'Total Cost (BDT)': results.fuelCost,
      'Generated Date': new Date().toLocaleString(),
    },
  ]
  
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `carbon-footprint-data-${Date.now()}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

