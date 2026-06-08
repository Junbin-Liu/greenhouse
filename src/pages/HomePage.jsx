import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import WeatherWidget from '../components/WeatherWidget'
import WaterButton from '../components/WaterButton'

// 植物详情弹出卡片
function PlantModal({ plant, onClose, onWater }) {
  if (!plant) return null
  const { info, nickname, status, daysSince, dueDays } = plant

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26, 47, 26, 0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#faf8f4] rounded-xl w-full max-w-[340px] overflow-hidden shadow-2xl border border-[#e8e4dc]"
        onClick={e => e.stopPropagation()}
      >
        {/* 照片 */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img
            src={info?.image}
            alt={nickname}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#1a2f1a] text-lg shadow-sm"
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div className="p-5">
          <h3 className="font-bold text-xl text-[#1a2f1a] mb-0.5">{nickname}</h3>
          <p className="text-[10px] text-[#5a7c5a] italic font-serif mb-3">{info?.latin}</p>

          <div className={`text-xs mb-3 px-3 py-2 rounded-lg ${
            status === 'overdue' ? 'bg-red-50 text-red-600' :
            status === 'due' ? 'bg-amber-50 text-amber-700' :
            'bg-green-50 text-green-700'
          }`}>
            {status === 'overdue' ? `已逾期 ${Math.abs(dueDays)} 天 · 快渴坏了` :
             status === 'due' ? '今天该浇水了' :
             `还有 ${dueDays} 天需要浇水`}
          </div>

          <p className="text-xs text-[#7a9a7a] leading-relaxed mb-4">
            {info?.waterAmount} · {info?.waterInterval}天周期 · {info?.tags.join(' · ')}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => { onWater(plant.id); onClose() }}
              className="flex-1 py-3 bg-[#c45c4a] text-white rounded-lg text-sm font-medium shadow-md shadow-red-200"
            >
              浇水
            </button>
            <button
              onClick={() => { onClose(); /* 导航到详情页 */ }}
              className="flex-1 py-3 bg-[#f0ece4] text-[#3d5a3d] rounded-lg text-sm font-medium"
            >
              查看记录
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HomePage({ store }) {
  const navigate = useNavigate()
  const plants = store.getMyPlants()
  const duePlants = plants.filter(p => p.status === 'due' || p.status === 'overdue')
  const [wateredIds, setWateredIds] = useState(new Set())
  const [modalPlant, setModalPlant] = useState(null)
  const scrollRef = useRef(null)

  const activeDue = duePlants.filter(p => !wateredIds.has(p.id))
  const allDone = activeDue.length === 0 && duePlants.length > 0

  const handleWater = (id) => {
    store.waterPlant(id, '首页快速浇水')
    setWateredIds(prev => new Set([...prev, id]))
  }

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 160, behavior: 'smooth' })
    }
  }

  // 按花架分层
  const topPlant = plants.find(p => p.info?.shelf === 'top')
  const midPlant = plants.find(p => p.info?.shelf === 'mid')
  const bottomPlants = plants.filter(p => p.info?.shelf === 'bottom')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-24"
    >
      {/* 头部 */}
      <div className="px-5 pt-7 pb-4">
        <h1 className="text-[34px] font-bold text-[#1a2f1a] tracking-[6px] leading-tight"
          style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
          青舍
        </h1>
        <p className="text-xs text-[#8b7355] mt-1.5 tracking-[2px] font-light">
          一花一世界 · 一叶一菩提
        </p>
        <p className="text-[10px] text-[#7a9a7a] mt-1 tracking-[1px]">
          乙巳年 · 五月十一 · 广州南阳台
        </p>
      </div>

      {/* 天气 */}
      <div className="mx-5 mb-6 pb-3 border-b border-[#e8e4dc]">
        <WeatherWidget city={store.city} onCityChange={store.setCity} />
      </div>

      {/* 待办轮播 */}
      <AnimatePresence mode="wait">
        {activeDue.length > 0 && (
          <motion.div
            key="todo"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between px-5 mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg text-[#1a2f1a]" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
                  今日待办
                </span>
                <span className="text-[10px] text-[#c45c4a] bg-red-50 px-2 py-0.5 rounded-full">
                  {activeDue.length}株
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-full bg-[#f0ece4] flex items-center justify-center text-[#5a7c5a] text-xs">
                  ←
                </button>
                <button onClick={() => scroll(1)} className="w-7 h-7 rounded-full bg-[#f0ece4] flex items-center justify-center text-[#5a7c5a] text-xs">
                  →
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide snap-x snap-mandatory"
            >
              {activeDue.map((plant, i) => (
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="snap-start shrink-0 w-[140px] bg-[#faf8f4] rounded-xl p-3 border border-[#e8e4dc] shadow-sm"
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden border-2 border-[#e8e4dc]">
                    <img src={plant.info?.image} alt={plant.nickname} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm text-center text-[#1a2f1a] font-medium">{plant.nickname}</p>
                  <p className="text-[10px] text-center text-[#c45c4a] mt-1">
                    {plant.status === 'overdue' ? `逾期${Math.abs(plant.dueDays)}天` : '今日该浇'}
                  </p>
                  <div className="mt-2 flex justify-center">
                    <WaterButton size="sm" onWater={() => handleWater(plant.id)} plantEmoji={plant.info?.emoji} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 全部完成 */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-5 mb-6 bg-gradient-to-r from-[#e8ede3] to-[#f0f4ec] rounded-xl p-5 text-center border border-[#d4e0d0]"
          >
            <p className="text-2xl mb-1">🌿</p>
            <p className="text-sm font-medium text-[#3d5a3d]">今日任务全部完成</p>
            <p className="text-xs text-[#7a9a7a] mt-1">植物们都喝饱啦</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 花架 */}
      <div className="px-4 mb-6">
        <div className="flex items-baseline gap-2 mb-4 px-1">
          <span className="text-lg text-[#1a2f1a]" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
            我的花架
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#e8e4dc] to-transparent" />
        </div>

        <div className="bg-gradient-to-b from-[rgba(139,105,20,0.04)] to-[rgba(139,105,20,0.02)] rounded-lg p-4 border border-[rgba(139,105,20,0.08)] relative">
          {/* 层板线 */}
          <div className="absolute left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#c4a77d] to-transparent" style={{ top: '38%' }} />
          <div className="absolute left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#c4a77d] to-transparent" style={{ bottom: '32%' }} />

          <div className="flex flex-col items-center gap-0 relative">
            {/* 顶层 - 百合竹 */}
            {topPlant && (
              <div className="relative z-10 mb-[-12px]">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalPlant(topPlant)}
                  className="w-[150px] h-[150px] rounded-full overflow-hidden border-[3px] border-[#c4a77d] shadow-lg shadow-[rgba(139,105,20,0.15)] cursor-pointer bg-[#faf8f4]"
                >
                  <img src={topPlant.info?.image} alt={topPlant.nickname} className="w-full h-full object-cover" />
                </motion.div>
                <div className="text-center mt-2">
                  <p className="text-base text-[#1a2f1a] font-medium">{topPlant.nickname}</p>
                  <p className="text-[10px] text-[#7a9a7a]">约1.2米</p>
                </div>
              </div>
            )}

            {/* 中层 - 蓝花楹 */}
            {midPlant && (
              <div className="relative z-[5] mb-[-8px]">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalPlant(midPlant)}
                  className="w-[120px] h-[120px] rounded-full overflow-hidden border-[2px] border-[#c4a77d] shadow-md shadow-[rgba(139,105,20,0.12)] cursor-pointer bg-[#faf8f4]"
                >
                  <img src={midPlant.info?.image} alt={midPlant.nickname} className="w-full h-full object-cover" />
                </motion.div>
                <div className="text-center mt-1.5">
                  <p className="text-sm text-[#1a2f1a] font-medium">{midPlant.nickname}</p>
                  <p className="text-[10px] text-[#7a9a7a]">约0.6米</p>
                </div>
              </div>
            )}

            {/* 底层 - 4小盆 */}
            <div className="flex justify-center gap-3 pt-3 relative z-[1]">
              {bottomPlants.map(plant => (
                <div key={plant.id} className="text-center relative">
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setModalPlant(plant)}
                    className="w-[72px] h-[72px] rounded-full overflow-hidden border-[2px] border-[#c4a77d] shadow-sm cursor-pointer bg-[#faf8f4] relative"
                  >
                    <img src={plant.info?.image} alt={plant.nickname} className="w-full h-full object-cover" />
                    {(plant.status === 'overdue' || plant.status === 'due') && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#c45c4a] rounded-full flex items-center justify-center text-white text-[9px] shadow-md">
                        !
                      </div>
                    )}
                  </motion.div>
                  <p className="text-xs text-[#1a2f1a] mt-1.5">{plant.nickname}</p>
                  <p className="text-[9px] text-[#7a9a7a]">约0.3米</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 弹出卡片 */}
      <AnimatePresence>
        {modalPlant && (
          <PlantModal
            plant={modalPlant}
            onClose={() => setModalPlant(null)}
            onWater={handleWater}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
