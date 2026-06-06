import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, Sparkles } from 'lucide-react'

export default function WaterButton({ onWater, plantEmoji = '🌱' }) {
  const [phase, setPhase] = useState('idle') // idle | watering | happy
  const [ripples, setRipples] = useState([])

  const handleClick = () => {
    if (phase !== 'idle') return

    const id = Date.now()
    setRipples(prev => [...prev, id])
    setPhase('watering')

    // Trigger the actual water action
    onWater()

    // Sequence: watering -> happy
    setTimeout(() => {
      setPhase('happy')
      setRipples(prev => prev.filter(r => r !== id))
    }, 800)

    setTimeout(() => {
      setPhase('idle')
    }, 2500)
  }

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      {/* Happy message */}
      <AnimatePresence>
        {phase === 'happy' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-10 whitespace-nowrap bg-forest-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg z-20"
          >
            <span className="flex items-center gap-1">
              <Sparkles size={12} />
              喝饱啦，好开心~
            </span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-forest-600 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-16 h-16">
        {/* Ripple rings */}
        <AnimatePresence>
          {ripples.map(id => (
            <motion.span
              key={id}
              initial={{ scale: 0.5, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-water-400 pointer-events-none"
            />
          ))}
        </AnimatePresence>

        {/* Falling water drops */}
        <AnimatePresence>
          {phase === 'watering' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`drop-${i}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: '-20%',
                  }}
                  initial={{ y: -20, opacity: 0, scale: 0.3 }}
                  animate={{
                    y: [0, 35, 70],
                    opacity: [0, 1, 0],
                    scale: [0.3, 1, 0.5],
                    rotate: [0, 10, -5],
                  }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.06,
                    ease: 'easeIn',
                  }}
                >
                  <Droplets size={12 + Math.random() * 6} className="text-water-400" fill="currentColor" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Plant emoji that reacts */}
        <AnimatePresence>
          {phase === 'happy' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1, y: [0, -8, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl z-10"
            >
              {plantEmoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.08 }}
          onClick={handleClick}
          className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
            phase === 'happy'
              ? 'bg-gradient-to-br from-moss-300 to-forest-400 shadow-lg shadow-forest-400/30'
              : phase === 'watering'
                ? 'bg-gradient-to-br from-water-300 to-water-500 shadow-lg shadow-water-400/40'
                : 'bg-gradient-to-br from-water-400 to-water-500 shadow-lg shadow-water-400/30'
          }`}
        >
          <motion.div
            animate={phase === 'watering' ? { rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Droplets size={26} className="text-white" />
          </motion.div>
        </motion.button>
      </div>

      {/* Label */}
      <span className={`text-[10px] font-medium transition-colors ${
        phase === 'happy' ? 'text-forest-500' : 'text-forest-400'
      }`}>
        {phase === 'happy' ? '已浇水' : phase === 'watering' ? '浇水ing...' : '浇水'}
      </span>
    </div>
  )
}
