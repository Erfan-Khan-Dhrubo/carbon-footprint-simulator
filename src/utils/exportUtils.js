import jsPDF from "jspdf";

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const formatNumber = (value, fractionDigits = 2) => {
  const num = toNumber(value);
  return num === null ? "N/A" : num.toFixed(fractionDigits);
};

const formatCurrency = (value) => {
  const num = toNumber(value);
  return num === null ? "N/A" : num.toLocaleString("en-BD");
};

/**
 * Export simulation results as PDF
 */
export function exportToPDF(results, formData) {
  const doc = new jsPDF();

  // Use only ASCII in labels to avoid font glyph issues
  const loadAmount = formatNumber(formData.loadAmount, 2);
  const vehicleCapacity = formatNumber(
    results.vehicleCapacity ?? formData.vehicleCapacity,
    2
  );
  const distance = formatNumber(results.distance, 2);
  const fuelUsed = formatNumber(results.fuelUsed, 2);
  const co2 = formatNumber(results.co2Emissions, 2);
  const cost = formatCurrency(results.fuelCost);
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SME Delivery Carbon Footprint Report", 105, 20, {
    align: "center",
  });
  
  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, {
    align: "center",
  });
  
  let yPos = 45
  
  // Trip Information
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Trip Information", 20, yPos);
  yPos += 10;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const tripInfo = [
    `Start Location: ${formData.startLocation || "N/A"}`,
    `Destination: ${formData.destination || "N/A"}`,
    `Vehicle Type: ${formData.vehicleType || "N/A"}`,
    `Fuel Type: ${formData.fuelType || "N/A"}`,
    `Load Amount: ${loadAmount} kg`,
    `Vehicle Capacity: ${vehicleCapacity} kg`,
    `Number of Trips: ${formData.numTrips || "N/A"}`,
  ];
  tripInfo.forEach((line) => {
    doc.text(line, 20, yPos);
    yPos += 7;
  });
  yPos += 5;
  
  // Results
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Simulation Results", 20, yPos);
  yPos += 10;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const resultsInfo = [
    `Distance: ${distance} km`,
    `Fuel Consumed: ${fuelUsed} ${results.fuelType === "cng" ? "kg" : "L"}`,
    `CO2 Emissions: ${co2} kg`,
    `Total Cost: ${cost} BDT`,
  ];
  resultsInfo.forEach((line) => {
    doc.text(line, 20, yPos);
    yPos += 7;
  });
  yPos += 5;
  
  // Optimization Suggestions
  if (results.optimizationSuggestions && results.optimizationSuggestions.totalSuggestions > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Optimization Suggestions", 20, yPos);
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
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

