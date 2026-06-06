import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Droplets, Scissors, Sun, Thermometer, Clock, Heart, CalendarDays } from 'lucide-react'
import WaterButton from '../components/WaterButton'

export default function PlantDetailPage({ store }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const plant = store.getPlantById(id)
  const [showWaterEffect, setShowWaterEffect] = useState(false)

  if (!plant || !plant.info) {
    return (
      <div className="flex items-center justify-center h-screen text-forest-400">
        植物未找到
      </div>
    )
  }

  const { info, nickname, lastWatered, daysSince, dueDays, status, health, logs } = plant

  const handleWater = () => {
    setShowWaterEffect(true)
    store.waterPlant(id, '详情页浇水')
    setTimeout(() => setShowWaterEffect(false), 2000)
  }

  const statusText = {
    overdue: `已逾期 ${Math.abs(dueDays)} 天，该浇水了`,
    due: '今天该浇水了',
    healthy: dueDays > 1 ? `还有 ${dueDays} 天需要浇水` : '状态良好',
  }[status] || '状态良好'

  const statusColor = {
    overdue: 'text-red-500',
    due: 'text-amber-600',
    healthy: 'text-forest-500',
  }[status] || 'text-forest-500'

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-cream-100"
    >
      {/* Header Image Area */}
      <div className="relative bg-gradient-to-b from-forest-50 to-cream-100 pt-6 pb-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/70 flex items-center justify-center shadow-sm z-10"
        >
          <ArrowLeft size={18} className="text-forest-600" />
        </button>

        <div className="flex flex-col items-center pt-4">
          <motion.div
            animate={showWaterEffect ? { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] } : {}}
            transition={{ duration: 0.6 }}
            className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl shadow-md mb-3"
            style={{ backgroundColor: info.color + '25' }}
          >
            {info.emoji}
          </motion.div>
          <h1 className="text-xl font-bold text-forest-800">{nickname}</h1>
          <p className="text-xs text-forest-400 mt-0.5 italic">{info.latin}</p>
          <div className="flex gap-2 mt-2">
            {info.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-forest-100 text-forest-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Status Panel */}
      <div className="px-4 -mt-2">
        <div className="bg-white/70 rounded-2xl p-4 border border-wood-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-forest-600">健康度</span>
            <span className="text-sm font-bold text-forest-700">{health}%</span>
          </div>
          <div className="h-2 bg-wood-100 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: info.color }}
              initial={{ width: 0 }}
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-forest-500">
              <Clock size={14} className="text-forest-400" />
              <span>上次浇水 {daysSince} 天前</span>
            </div>
            <div className={`flex items-center gap-2 font-medium ${statusColor}`}>
              <Droplets size={14} />
              <span>{statusText}</span>
            </div>
            <div className="flex items-center gap-2 text-forest-500">
              <Sun size={14} className="text-amber-400" />
              <span>{info.light}</span>
            </div>
            <div className="flex items-center gap-2 text-forest-500">
              <Thermometer size={14} className="text-red-400" />
              <span>{info.temp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Water Action */}
      <div className="px-4 mt-5">
        <div className="bg-gradient-to-br from-water-300/30 to-water-400/20 rounded-2xl p-5 border border-water-300/50 text-center">
          <p className="text-sm text-forest-600 mb-3">{info.waterAmount} · 建议周期 {info.waterInterval} 天</p>
          <div className="flex justify-center">
            <WaterButton onWater={handleWater} />
          </div>
          <AnimatePresence>
            {showWaterEffect && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-water-500 font-medium mt-3"
              >
                {nickname} 喝饱啦！下次建议 {new Date(Date.now() + info.waterInterval * 86400000).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 mt-5">
        <h3 className="text-sm font-semibold text-forest-700 mb-2">植物简介</h3>
        <p className="text-sm text-forest-500 leading-relaxed bg-white/50 rounded-xl p-3 border border-wood-200">
          {info.description}
        </p>
      </div>

      {/* Tips */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-forest-700 mb-2">养护贴士</h3>
        <div className="space-y-2">
          {info.tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-sm text-forest-500 bg-white/40 rounded-lg px-3 py-2"
            >
              <Heart size={12} className="text-forest-400 mt-0.5 shrink-0" />
              <span>{tip}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div className="px-4 mt-5 pb-8">
        <h3 className="text-sm font-semibold text-forest-700 mb-2 flex items-center gap-1.5">
          <CalendarDays size={14} />
          照顾记录
        </h3>
        {logs && logs.length > 0 ? (
          <div className="space-y-2">
            {logs.slice(0, 10).map((log, i) => (
              <div key={i} className="flex items-center gap-3 text-sm bg-white/40 rounded-lg px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${log.type === 'water' ? 'bg-water-400' : 'bg-forest-400'}`} />
                <span className="text-forest-500">
                  {log.type === 'water' ? '浇水' : log.type === 'fertilize' ? '施肥' : '修剪'}
                </span>
                <span className="text-forest-300 text-xs ml-auto">
                  {new Date(log.date).toLocaleDateString('zh-CN')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-forest-400">暂无记录</p>
        )}
      </div>
    </motion.div>
  )
}
