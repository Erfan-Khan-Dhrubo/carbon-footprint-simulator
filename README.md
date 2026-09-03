# Web-Based Simulation of Delivery Carbon Footprints for SMEs in Bangladesh

A web-based simulation and decision-support tool designed to help **Small and Medium-sized Enterprises (SMEs) in Bangladesh** estimate, analyze, and reduce the carbon footprint and operational cost of their delivery operations.

The project accompanies the published research paper:

> **“Web-based Simulation of Delivery Carbon Footprints for SMEs in Bangladesh: An Eco-friendly and Fuel Optimization Framework for Sustainable Growth”**

The paper was published in the **Proceedings of the 8th IEOM Bangladesh International Conference on Industrial Engineering and Operations Management**, held in Dhaka, Bangladesh, on December 20–21, 2025.

---

## 🌱 About the Project

SMEs in Bangladesh often rely on informal routing, frequent unscheduled deliveries, inefficient vehicle utilization, and fuel management practices. These factors can increase both **delivery costs and carbon emissions**.

This project provides an accessible browser-based simulation tool that allows users to model delivery scenarios and understand how different operational decisions affect:

- 🚚 Fuel consumption
- 🌍 CO₂ emissions
- 💰 Operational cost
- 📦 Vehicle load utilization
- 🛣️ Delivery distance
- ⛽ Fuel selection
- 🔄 Alternative delivery scenarios

The goal is to make sustainability analysis more accessible to SMEs without requiring specialized logistics or carbon-accounting software.

---

## ✨ Key Features

### 📊 Carbon Footprint Simulation

Calculate estimated CO₂ emissions based on:

- Vehicle type
- Fuel type
- Delivery distance
- Number of trips
- Cargo load
- Vehicle capacity

The core model calculates emissions using fuel consumption, fuel-specific emission factors, and a dynamic load factor.

### 🚚 Vehicle Comparison

The simulator supports multiple vehicle categories, including:

- Motorcycle
- Auto-rickshaw
- Car
- Van
- Pickup Truck
- Small Truck
- Large Truck

Vehicle efficiency and capacity parameters are incorporated into the simulation model.

### ⛽ Fuel Analysis

Users can compare different fuel types and evaluate their environmental and financial effects:

- Petrol
- Diesel
- Octane
- CNG
- Electric

The model incorporates fuel-specific emission factors and fuel prices based on the parameters described in the research paper.

### 📦 Load Optimization

The simulator accounts for vehicle load utilization instead of assuming constant fuel efficiency.

A load factor is applied according to the relationship between the actual cargo weight and vehicle capacity. This allows the system to model the additional fuel consumption and emissions associated with heavier loads.

### 🛣️ Route Analysis

Users can provide an origin and destination for delivery scenario analysis.

The prototype uses route information for contextualization and supports distance-based calculations. The research implementation uses a default distance when an explicit route calculation is not available, while the interface can display route information.

### 🔄 Scenario Comparison

Two delivery scenarios can be compared side-by-side.

The system can analyze changes in:

- Route distance
- Vehicle selection
- Fuel type
- Load conditions
- Number of trips
- Fuel consumption
- CO₂ emissions
- Operational cost

This enables users to perform sensitivity analysis and evaluate potential optimization strategies.

### 📈 Data Visualization

The results are presented through:

- Metric cards
- Comparative tables
- Bar charts
- Scenario comparisons
- Route visualization

Chart.js is used for data visualization and comparative scenario analysis.

### 💡 Optimization Recommendations

The simulator can be used to investigate strategies such as:

- Route optimization
- Vehicle right-sizing
- Load consolidation
- Fuel switching
- Fleet electrification

The research demonstrates that these strategies can provide both environmental and economic benefits for SME delivery operations.

---

## 🧮 Simulation Model

The system uses a modular mathematical model consisting of several core calculations.

### Fuel Consumption

The estimated total fuel consumption is:

```text
Ftotal = (d / Evehicle) × Ntrips
```

Where:

- `d` = delivery distance in kilometers
- `Evehicle` = vehicle fuel efficiency in km/L
- `Ntrips` = number of one-way trips

### Load Factor

The load adjustment factor is:

```text
LF = 1 + 0.2 × (Wload / Wcapacity)
```

This represents the additional fuel/emission impact associated with vehicle payload.

For example:

| Vehicle Load | Load Factor |
| ------------ | ----------: |
| Empty        |         1.0 |
| 50% loaded   |         1.1 |
| Fully loaded |         1.2 |

### CO₂ Emissions

The estimated emissions are calculated as:

```text
ECO₂ = Ftotal × EFfuel × LF
```

Where:

- `Ftotal` = total fuel consumed
- `EFfuel` = emission factor of the selected fuel
- `LF` = load factor

### Operational Cost

Fuel cost is calculated as:

```text
Ctotal = Ftotal × Pfuel
```

Where:

- `Ftotal` = total fuel consumption
- `Pfuel` = fuel price in BDT per litre or kilogram

---

## 🏗️ System Architecture

The application follows a three-layer architecture:

```text
┌──────────────────────────────┐
│       User Input Layer       │
│                              │
│ Route • Vehicle • Fuel       │
│ Load • Trips • Capacity      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   Calculation & Processing   │
│                              │
│ Fuel • Distance • CO₂        │
│ Load Factor • Cost           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   Results & Visualization    │
│                              │
│ Metrics • Charts • Maps      │
│ Scenario Comparison          │
└──────────────────────────────┘
```

The application is implemented as a **client-side Single Page Application (SPA)**, allowing the primary calculations to be performed directly in the user's browser.

---

## 🛠️ Technology Stack

| Technology          | Purpose                          |
| ------------------- | -------------------------------- |
| **React.js 18+**    | Frontend framework               |
| **JavaScript ES6+** | Application and simulation logic |
| **Framer Motion**   | UI animations and transitions    |
| **Chart.js**        | Data visualization               |
| **Leaflet**         | Route/map visualization          |

The architecture is modular so that individual calculation functions can be tested and future services can be integrated.

---

## 📁 Project Structure

A typical project structure is:

```text
project-root/
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── utils/
│   │   └── calculations.js
│   ├── App.js
│   └── main.js
│
├── package.json
├── README.md
└── ...
```

The calculation engine is designed as a modular component so that the simulation logic can be maintained and extended independently from the user interface.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Navigate into the project:

```bash
cd YOUR_REPOSITORY
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application should then be available through the local development server shown in your terminal.

---

## 💻 How to Use

### 1. Enter Delivery Information

Provide:

- Starting location
- Destination
- Vehicle type
- Fuel type
- Cargo/load amount
- Number of trips
- Vehicle capacity

### 2. Run the Simulation

The application processes the supplied parameters and estimates:

- Distance
- Fuel consumption
- CO₂ emissions
- Load utilization
- Operational cost

### 3. Analyze the Results

Review the calculated metrics and visualizations.

### 4. Compare Scenarios

Modify parameters such as vehicle type, fuel, route, or load and compare the results with another scenario.

### 5. Identify Optimization Opportunities

Use the comparison results to identify potentially more sustainable and cost-effective delivery strategies.

---

## 📊 Research Findings

The research demonstrated several important findings through controlled simulations.

For a 203 km Dhaka–Khulna delivery carrying 50 kg:

| Vehicle     | Fuel   | Fuel Used |      CO₂ |         Cost |
| ----------- | ------ | --------: | -------: | -----------: |
| Motorcycle  | Petrol |    5.08 L | 12.91 kg |   609.60 BDT |
| Car         | CNG    |   13.53 L | 38.45 kg | 1,150.05 BDT |
| Van         | Diesel |   16.92 L | 45.91 kg | 1,945.80 BDT |
| Small Truck | Diesel |   25.38 L | 68.36 kg | 2,918.70 BDT |

The analysis indicates that selecting an appropriately sized vehicle can significantly affect both emissions and operating costs.

The study also found that, for a 1,000 kg load over 100 km, using two efficient vans instead of a poorly utilized large truck reduced emissions by **38.3%** and operating cost by **41.7%**.

---

## 🌍 Sustainable Development Goals

This project contributes to:

### SDG 12 — Responsible Consumption and Production

The tool encourages more efficient use of fuel, vehicles, and delivery resources.

### SDG 13 — Climate Action

By allowing SMEs to estimate and compare their delivery emissions, the system supports informed actions for reducing carbon footprints.

The research specifically identifies the tool as a practical way for SMEs to connect logistics decision-making with SDG 12 and SDG 13.

---

## 🔬 Research Publication

This software was developed as part of the research presented in:

**Web-based Simulation of Delivery Carbon Footprints for SMEs in Bangladesh: An Eco-friendly and Fuel Optimization Framework for Sustainable Growth**

**Authors:**

- **Erfan Khan** — Department of Computer Science and Engineering, BRAC University
- **Farah Tabussum** — Department of Computer Science and Engineering, BRAC University
- **Kazi Abdur Rahim** — Department of Electrical and Electronic Engineering, BRAC University

The paper was published in the proceedings of the **8th IEOM Bangladesh International Conference on Industrial Engineering and Operations Management**, December 20–21, 2025.

---

## 🔮 Future Work

Several improvements are proposed for future versions of the system:

- Integration with commercial routing APIs such as Google Maps Distance Matrix
- More accurate real-world distance and route calculations
- Traffic and road-condition considerations
- Machine-learning-based delivery demand forecasting
- Multimodal logistics analysis, including inland water transportation
- Lifecycle assessment of vehicles
- Incorporation of indirect emissions from electricity generation
- Integration with fleet management and vehicle telematics systems

These extensions would allow the platform to move toward more comprehensive real-world logistics optimization.

---

## 📄 Publication & Citation

If you use this project or its methodology in academic work, please cite the associated research paper.

```text
Khan, E., Tabussum, F., & Rahim, K. A. (2025).
Web-based Simulation of Delivery Carbon Footprints for SMEs in Bangladesh:
An Eco-friendly and Fuel Optimization Framework for Sustainable Growth.
Proceedings of the 8th IEOM Bangladesh International Conference on
Industrial Engineering and Operations Management, Dhaka, Bangladesh.
```

---

## 👨‍💻 Authors

### Erfan Khan

Computer Science and Engineering
BRAC University
Dhaka, Bangladesh

Research interests include web-based simulation, sustainable logistics, and technology-driven solutions for sustainability challenges.

### Farah Tabussum

Computer Science and Engineering
BRAC University
Dhaka, Bangladesh

Research interests include computer science, web development, and UI/UX design.

### Kazi Abdur Rahim

Electrical and Electronic Engineering
BRAC University
Dhaka, Bangladesh

---

## 📜 License

Add your preferred open-source license here.

For example:

```text
MIT License
```

---

## ⭐ Acknowledgements

This project was developed as a research-driven software implementation focused on making sustainable logistics analysis more accessible to SMEs in Bangladesh.

The research framework incorporates established approaches to vehicle efficiency, carbon-emission estimation, fuel costs, route optimization, and sustainable logistics.

---

**If you find this project useful, consider giving the repository a ⭐ on GitHub.**

# carbon-footprint-simulator
