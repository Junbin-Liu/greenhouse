import { motion } from 'framer-motion'
import { Droplets, AlertCircle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PlantCard({ plant, index, compact = false }) {
  const navigate = useNavigate()
  const { info, nickname, status, dueDays, daysSince } = plant

  const statusStyles = {
    overdue: {
      ring: 'ring-red-300',
      bg: 'bg-gradient-to-br from-red-50 to-orange-50',
      accent: 'text-red-500',
      badge: 'bg-red-100 text-red-600',
      urgency: '口渴很久了',
    },
    due: {
      ring: 'ring-amber-300',
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
      accent: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-700',
      urgency: '今天该喝水啦',
    },
    healthy: {
      ring: 'ring-moss-300',
      bg: 'bg-gradient-to-br from-cream-50 to-moss-50',
      accent: 'text-forest-500',
      badge: 'bg-moss-100 text-forest-600',
      urgency: `${dueDays > 1 ? `还有 ${dueDays} 天` : '状态不错'}`,
    },
  }

  const style = statusStyles[status] || statusStyles.healthy

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/plant/${plant.id}`)}
      className={`relative rounded-2xl ${style.bg} p-4 cursor-pointer overflow-hidden ring-1 ${style.ring} shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Decorative blob */}
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: info?.color }}
      />

      <div className="relative flex items-center gap-4">
        {/* Large emoji avatar */}
        <motion.div
          animate={status === 'overdue' ? { rotate: [-2, 2, -2], transition: { repeat: Infinity, duration: 2 } } : {}}
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0"
          style={{ backgroundColor: info?.color + '18' }}
        >
          {info?.emoji}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-forest-800 text-base">{nickname}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${style.badge}`}>
              {style.urgency}
            </span>
          </div>

          <p className="text-xs text-forest-400 mb-2">{info?.category} · {info?.waterInterval}天周期</p>

          {/* Thirst bar - cute water drop visualization */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: status === 'overdue'
                    ? 'linear-gradient(90deg, #ef4444, #f97316)'
                    : status === 'due'
                      ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                      : 'linear-gradient(90deg, #4A7C59, #8FB996)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, Math.min(100, 100 - (daysSince / (info?.waterInterval || 7)) * 100))}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(3)].map((_, i) => (
                <Droplets
                  key={i}
                  size={10}
                  className={i < (status === 'overdue' ? 0 : status === 'due' ? 1 : 2) ? style.accent : 'text-wood-200'}
                  fill={i < (status === 'overdue' ? 0 : status === 'due' ? 1 : 2) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>
        </div>

        <ChevronRight size={18} className="text-forest-300 shrink-0" />
      </div>
    </motion.div>
  )
}
