import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WeatherWidget from '../components/WeatherWidget'
import WaterButton from '../components/WaterButton'
import { SEASON_ADVICE } from '../data/plantDatabase'

// 获取植物当前季节建议
function getPlantSeasonTip(plant, month) {
  const info = plant.info
  if (!info) return null

  if (month >= 6 && month <= 8) {
    if (info.tags.includes('喜湿')) return '高温多喷雾'
    if (info.tags.includes('喜阳')) return '正午需遮阴'
    return '早晚浇水为佳'
  } else if (month >= 12 || month <= 2) {
    if (info.tags.includes('喜湿')) return '冬季控水防冻'
    return '远离暖气风口'
  } else if (month >= 3 && month <= 5) {
    if (info.category === '多肉花卉') return '春季换盆好时节'
    return '春季可适量追肥'
  } else {
    return '逐渐减少浇水量'
  }
}

// 植物详情弹出卡片（含时节建议）
function PlantModal({ plant, onClose, onWater }) {
  if (!plant) return null
  const { info, nickname, status, dueDays } = plant
  const month = new Date().getMonth() + 1
  const seasonTip = getPlantSeasonTip(plant, month)
  const currentSeason = Object.values(SEASON_ADVICE).find(s => s.months.includes(month)) || SEASON_ADVICE.spring

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
        className="bg-[#faf8f4] rounded-xl w-full max-w-[340px] overflow-hidden shadow-2xl border border-[#e8e4dc] max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 照片 */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img src={info?.image} alt={nickname} className="w-full h-full object-cover" />
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

          {/* 时节建议 */}
          <div className="bg-[#f0f4ec] rounded-lg p-3 mb-3 border border-[#d4e0d0]">
            <p className="text-[10px] text-[#5a7c5a] mb-1">{currentSeason.name} · {currentSeason.theme}</p>
            <p className="text-xs text-[#3d5a3d] font-medium">💡 {seasonTip}</p>
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
              onClick={onClose}
              className="flex-1 py-3 bg-[#f0ece4] text-[#3d5a3d] rounded-lg text-sm font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 检查更新组件（缩小版）
function UpdateChecker() {
  const [status, setStatus] = useState('idle')
  const [remoteVersion, setRemoteVersion] = useState('')
  const LOCAL_VERSION = '1.2.0'

  const check = async () => {
    setStatus('checking')
    try {
      const res = await fetch(`/greenhouse/version.json?t=${Date.now()}`, { cache: 'no-store' })
      const json = await res.json()
      setRemoteVersion(json.version)
      if (json.version !== LOCAL_VERSION) {
        setStatus('available')
      } else {
        setStatus('latest')
        setTimeout(() => setStatus('idle'), 2000)
      }
    } catch {
      setStatus('idle')
    }
  }

  if (status === 'available') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#c45c4a]">发现新版本 v{remoteVersion}</span>
        <button onClick={() => window.location.reload(true)} className="px-3 py-1 bg-[#3d5a3d] text-white rounded-full text-[10px]">
          刷新更新
        </button>
      </div>
    )
  }
  if (status === 'latest') {
    return <span className="text-xs text-[#5a7c5a]">已是最新版本</span>
  }
  return (
    <button onClick={check} disabled={status === 'checking'} className="flex items-center gap-1 text-xs text-[#7a9a7a]">
      <span className={status === 'checking' ? 'animate-spin' : ''}>↻</span>
      {status === 'checking' ? '检查中...' : '检查更新'}
    </button>
  )
}

export default function HomePage({ store }) {
  const plants = store.getMyPlants()
  const duePlants = plants.filter(p => p.status === 'due' || p.status === 'overdue')
  const [wateredIds, setWateredIds] = useState(new Set())
  const [modalPlant, setModalPlant] = useState(null)
  const scrollRef = useRef(null)
  const month = new Date().getMonth() + 1
  const currentSeason = Object.values(SEASON_ADVICE).find(s => s.months.includes(month)) || SEASON_ADVICE.spring

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-8"
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
                <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-full bg-[#f0ece4] flex items-center justify-center text-[#5a7c5a] text-xs">←</button>
                <button onClick={() => scroll(1)} className="w-7 h-7 rounded-full bg-[#f0ece4] flex items-center justify-center text-[#5a7c5a] text-xs">→</button>
              </div>
            </div>

            <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide snap-x snap-mandatory">
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
                    <WaterButton size="sm" onWater={() => handleWater(plant.id)} />
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

      {/* 时节总览 */}
      <div className="px-5 mb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg text-[#1a2f1a]" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
            {currentSeason.name} · {currentSeason.theme}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#e8e4dc] to-transparent" />
        </div>
        <div className="bg-[#faf8f4] rounded-xl p-4 border border-[#e8e4dc]">
          <div className="space-y-2">
            {currentSeason.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[#3d5a3d]">
                <span className="w-5 h-5 rounded-full bg-[rgba(90,124,90,0.12)] text-[#3d5a3d] text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 我的植物 - 列表（含时节建议） */}
      <div className="px-5 mb-6">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg text-[#1a2f1a]" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
            我的植物
          </span>
          <span className="text-[10px] text-[#7a9a7a]">共{plants.length}株</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#e8e4dc] to-transparent" />
        </div>

        <div className="space-y-3">
          {plants.map((plant, i) => {
            const seasonTip = getPlantSeasonTip(plant, month)
            return (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModalPlant(plant)}
                className="bg-[#faf8f4] rounded-xl p-3 border border-[#e8e4dc] shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#e8e4dc] shrink-0">
                    <img src={plant.info?.image} alt={plant.nickname} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[#1a2f1a]">{plant.nickname}</h3>
                      {(plant.status === 'overdue' || plant.status === 'due') && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">
                          {plant.status === 'overdue' ? `逾期${Math.abs(plant.dueDays)}天` : '今日'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7a9a7a] mt-0.5">
                      {plant.info?.waterAmount} · {plant.info?.waterInterval}天周期
                    </p>
                    {/* 时节建议标签 */}
                    {seasonTip && (
                      <p className="text-[10px] text-[#5a7c5a] mt-1 bg-[#f0f4ec] inline-block px-2 py-0.5 rounded-full">
                        💡 {seasonTip}
                      </p>
                    )}
                  </div>
                  <div className="text-[#c4a77d] text-lg">›</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 底部区域：关于 + 检查更新 */}
      <div className="mx-5 mb-6 bg-[#faf8f4] rounded-xl p-4 border border-[#e8e4dc]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#1a2f1a]">关于青舍</span>
          <UpdateChecker />
        </div>
        <p className="text-[11px] text-[#7a9a7a] leading-relaxed">
          青舍是一款专注于绿植养护管理的 PWA 应用。所有数据存储在本地浏览器中，天气数据来自 Open-Meteo 免费 API。
        </p>
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
