import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, Sprout, ChevronLeft, ChevronRight } from 'lucide-react'
import PlantCard from '../components/PlantCard'
import WeatherWidget from '../components/WeatherWidget'
import WaterButton from '../components/WaterButton'

export default function HomePage({ store }) {
  const plants = store.getMyPlants()
  const duePlants = plants.filter(p => p.status === 'due' || p.status === 'overdue')
  const [wateredIds, setWateredIds] = useState(new Set())
  const scrollRef = useRef(null)

  // Filter out already watered plants from due list
  const activeDue = duePlants.filter(p => !wateredIds.has(p.id))
  const allDone = activeDue.length === 0 && duePlants.length > 0

  const handleWater = (id) => {
    store.waterPlant(id, '首页快速浇水')
    setWateredIds(prev => new Set([...prev, id]))
  }

  const scroll = (dir) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth * 0.82
      scrollRef.current.scrollBy({ left: dir * cardWidth, behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 pt-6 pb-4 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-800 tracking-tight">青舍</h1>
          <p className="text-sm text-forest-400 mt-0.5">你的私人花房管家</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
          <Sprout size={20} className="text-forest-500" />
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget city={store.city} onCityChange={store.setCity} />

      {/* Today's Todo - Carousel */}
      <AnimatePresence mode="wait">
        {activeDue.length > 0 && (
          <motion.div
            key="todo-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-forest-700 flex items-center gap-1.5">
                <Droplets size={16} className="text-water-500" />
                今日待办
              </h2>
              <div className="flex items-center gap-1">
                <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-full bg-forest-100 flex items-center justify-center text-forest-500">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-forest-400 mx-1">{activeDue.length} 株</span>
                <button onClick={() => scroll(1)} className="w-7 h-7 rounded-full bg-forest-100 flex items-center justify-center text-forest-500">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Horizontal scroll carousel */}
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {activeDue.map((plant, i) => (
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30, scale: 0.9 }}
                  transition={{ delay: i * 0.1 }}
                  className="snap-start shrink-0 w-[82%]"
                >
                  <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl p-4 border border-wood-200 shadow-sm relative overflow-hidden">
                    {/* Decorative */}
                    <div
                      className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-10"
                      style={{ backgroundColor: plant.info?.color }}
                    />

                    <div className="relative flex items-start gap-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                        style={{ backgroundColor: plant.info?.color + '20' }}
                      >
                        {plant.info?.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-forest-800">{plant.nickname}</h3>
                        <p className="text-xs text-forest-400 mt-0.5">
                          {plant.status === 'overdue' ? `已逾期 ${Math.abs(plant.dueDays)} 天` : '今天该浇水了'}
                        </p>
                        <p className="text-[10px] text-forest-300 mt-1">
                          建议：{plant.info?.waterAmount} · {plant.info?.waterInterval}天周期
                        </p>
                      </div>
                    </div>

                    {/* Water action area */}
                    <div className="relative flex items-center justify-center mt-4 pt-3 border-t border-wood-100">
                      <WaterButton
                        onWater={() => handleWater(plant.id)}
                        plantEmoji={plant.info?.emoji}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All done celebration */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-r from-moss-100 to-forest-100 rounded-2xl p-5 text-center border border-moss-200"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl mb-2"
            >
              🌿✨
            </motion.div>
            <p className="text-sm font-semibold text-forest-700">今日任务全部完成！</p>
            <p className="text-xs text-forest-500 mt-1">你的植物们都喝饱啦，你真棒~</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Plants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-forest-700">我的植物</h2>
          <span className="text-xs text-forest-400">共 {plants.length} 株</span>
        </div>
        <div className="space-y-3">
          {plants.map((plant, i) => (
            <PlantCard key={plant.id} plant={plant} index={i} />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '总浇水', value: plants.reduce((s, p) => s + (p.logs?.filter(l => l.type === 'water').length || 0), 0), unit: '次' },
          { label: '待浇水', value: activeDue.length, unit: '株' },
          { label: '花园天数', value: Math.max(1, Math.floor((Date.now() - new Date(plants[0]?.addedAt).getTime()) / 86400000)), unit: '天' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-white/50 rounded-xl p-3 text-center border border-wood-200"
          >
            <p className="text-lg font-bold text-forest-700">{stat.value}{stat.unit}</p>
            <p className="text-[10px] text-forest-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
