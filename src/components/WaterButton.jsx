import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets } from 'lucide-react'

export default function WaterButton({ onWater, size = 'lg' }) {
  const [showDrops, setShowDrops] = useState(false)
  const [ripples, setRipples] = useState([])

  const handleClick = () => {
    const id = Date.now()
    setRipples(prev => [...prev, id])
    setShowDrops(true)
    onWater()
    setTimeout(() => setShowDrops(false), 1000)
    setTimeout(() => setRipples(prev => prev.filter(r => r !== id)), 600)
  }

  const sizeClasses = size === 'lg'
    ? 'w-20 h-20 text-3xl'
    : 'w-14 h-14 text-xl'

  return (
    <div className="relative inline-flex items-center justify-center">
      <AnimatePresence>
        {showDrops && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`drop-${i}`}
                className="absolute text-water-400 pointer-events-none"
                initial={{ y: -30, x: 0, opacity: 0, scale: 0.5 }}
                animate={{
                  y: 40 + Math.random() * 20,
                  x: (Math.random() - 0.5) * 60,
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.3],
                }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
              >
                <Droplets size={14} fill="currentColor" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {ripples.map(id => (
        <span
          key={id}
          className="absolute rounded-full bg-water-400/30 animate-ripple pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />
      ))}

      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleClick}
        className={`${sizeClasses} rounded-full bg-gradient-to-br from-water-400 to-water-500 text-white shadow-lg shadow-water-400/30 flex items-center justify-center relative z-10`}
      >
        <Droplets size={size === 'lg' ? 28 : 20} />
      </motion.button>
    </div>
  )
}
