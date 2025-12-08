import { motion } from 'framer-motion'
import { FaLeaf, FaTruck } from 'react-icons/fa'

function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <FaLeaf className="text-white text-3xl" />
          <div>
            <h1 className="text-3xl font-bold text-white">
              SME Delivery Carbon Footprint Simulator
            </h1>
            <p className="mt-2 text-green-50 flex items-center gap-2">
              <FaTruck className="text-sm" />
              Calculate delivery fuel use and CO₂ emissions for your business
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header

