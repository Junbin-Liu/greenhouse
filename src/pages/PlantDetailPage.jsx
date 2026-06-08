import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Droplets, Sun, Thermometer, Clock, Heart, CalendarDays } from 'lucide-react'
import WaterButton from '../components/WaterButton'

export default function PlantDetailPage({ store }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const plant = store.getPlantById(id)
  const [showWaterEffect, setShowWaterEffect] = useState(false)

  if (!plant || !plant.info) {
    return (
      <div className="flex items-center justify-center h-screen text-[#7a9a7a]">
        植物未找到
      </div>
    )
  }

  const { info, nickname, daysSince, dueDays, status, health, logs } = plant

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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#F5F2EC]"
    >
      {/* 顶部照片 */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={info?.image}
          alt={nickname}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F2EC]" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={18} className="text-[#1a2f1a]" />
        </button>
      </div>

      {/* 内容 */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-[#faf8f4] rounded-xl p-5 border border-[#e8e4dc] shadow-sm">
          <h1 className="text-2xl font-bold text-[#1a2f1a] mb-0.5">{nickname}</h1>
          <p className="text-[10px] text-[#5a7c5a] italic font-serif">{info?.latin}</p>

          <div className={`text-xs mt-3 px-3 py-2 rounded-lg ${
            status === 'overdue' ? 'bg-red-50 text-red-600' :
            status === 'due' ? 'bg-amber-50 text-amber-700' :
            'bg-green-50 text-green-700'
          }`}>
            {statusText}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="flex items-center gap-2 text-[#5a7c5a]">
              <Clock size={14} />
              <span>上次浇水 {daysSince} 天前</span>
            </div>
            <div className="flex items-center gap-2 text-[#5a7c5a]">
              <Sun size={14} />
              <span>{info?.light}</span>
            </div>
            <div className="flex items-center gap-2 text-[#5a7c5a]">
              <Thermometer size={14} />
              <span>{info?.temp}</span>
            </div>
            <div className="flex items-center gap-2 text-[#5a7c5a]">
              <Droplets size={14} />
              <span>{info?.waterAmount}</span>
            </div>
          </div>
        </div>

        {/* 浇水 */}
        <div className="mt-5 bg-gradient-to-br from-[rgba(126,181,166,0.15)] to-[rgba(90,155,138,0.1)] rounded-xl p-5 border border-[rgba(126,181,166,0.2)] text-center">
          <p className="text-sm text-[#3d5a3d] mb-3">{info?.waterAmount} · 建议周期 {info?.waterInterval} 天</p>
          <div className="flex justify-center">
            <WaterButton onWater={handleWater} />
          </div>
          <AnimatePresence>
            {showWaterEffect && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-[#5a9b8a] font-medium mt-3"
              >
                {nickname} 喝饱啦！
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* 简介 */}
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-[#1a2f1a] mb-2">植物简介</h3>
          <p className="text-sm text-[#5a7c5a] leading-relaxed bg-[#faf8f4] rounded-xl p-3 border border-[#e8e4dc]">
            {info?.description}
          </p>
        </div>

        {/* 贴士 */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#1a2f1a] mb-2">养护贴士</h3>
          <div className="space-y-2">
            {info?.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-[#5a7c5a] bg-[#faf8f4] rounded-lg px-3 py-2"
              >
                <Heart size={12} className="text-[#7a9a7a] mt-0.5 shrink-0" />
                <span>{tip}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 记录 */}
        <div className="mt-5 pb-8">
          <h3 className="text-sm font-semibold text-[#1a2f1a] mb-2 flex items-center gap-1.5">
            <CalendarDays size={14} />
            照顾记录
          </h3>
          {logs && logs.length > 0 ? (
            <div className="space-y-2">
              {logs.slice(0, 10).map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-sm bg-[#faf8f4] rounded-lg px-3 py-2">
                  <div className={`w-2 h-2 rounded-full ${log.type === 'water' ? 'bg-[#7eb5a6]' : 'bg-[#5a7c5a]'}`} />
                  <span className="text-[#5a7c5a]">
                    {log.type === 'water' ? '浇水' : log.type === 'fertilize' ? '施肥' : '修剪'}
                  </span>
                  <span className="text-[#7a9a7a] text-xs ml-auto">
                    {new Date(log.date).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7a9a7a]">暂无记录</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
