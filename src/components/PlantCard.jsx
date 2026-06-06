import { motion } from 'framer-motion'
import { Droplets, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PlantCard({ plant, index }) {
  const navigate = useNavigate()
  const { info, nickname, status, dueDays, daysSince, health } = plant

  const statusConfig = {
    overdue: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-600',
      icon: AlertCircle,
      text: `已逾期 ${Math.abs(dueDays)} 天`,
    },
    due: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
      icon: Droplets,
      text: '今天该浇水了',
    },
    healthy: {
      bg: 'bg-cream-50',
      border: 'border-wood-200',
      badge: 'bg-moss-100 text-forest-600',
      icon: CheckCircle2,
      text: `${dueDays > 1 ? `还有 ${dueDays} 天` : '状态良好'}`,
    },
  }

  const config = statusConfig[status] || statusConfig.healthy
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/plant/${plant.id}`)}
      className={`relative rounded-2xl border ${config.border} ${config.bg} p-4 cursor-pointer overflow-hidden`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm"
          style={{ backgroundColor: info?.color + '20' }}
        >
          {info?.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-forest-800 truncate">{nickname}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
              <StatusIcon size={10} className="inline mr-0.5 -mt-0.5" />
              {config.text}
            </span>
          </div>
          <p className="text-xs text-forest-400 mt-0.5">{info?.category}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-1.5 bg-wood-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: info?.color || '#4A7C59' }}
                initial={{ width: 0 }}
                animate={{ width: `${health}%` }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </div>
            <span className="text-[10px] text-forest-400">{health}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
